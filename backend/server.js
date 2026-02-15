// backend/server.js - Production Backend Implementation
const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');
const Razorpay = require('razorpay');
const AWS = require('aws-sdk');
const admin = require('firebase-admin');
const FormData = require('form-data');
const multer = require('multer');
const multerS3 = require('multer-s3');
require('dotenv').config();

const app = express();

// Initialize services
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// AWS S3 setup
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    key: function (req, file, cb) {
      cb(null, `uploads/${Date.now()}_${file.originalname}`);
    },
  }),
});

// Initialize Firebase Admin if service account provided
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    console.log('Firebase Admin initialized');
  } catch (e) {
    console.warn('Invalid FIREBASE_SERVICE_ACCOUNT, Firebase Admin not initialized');
  }
} else {
  console.warn('FIREBASE_SERVICE_ACCOUNT not set; auth verification disabled');
}

// Simple middleware to verify Firebase ID token
async function verifyFirebaseToken(req, res, next) {
  if (!admin.apps.length) return next(); // skip if not initialized
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification failed', err);
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

// Email transporter
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// File upload endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    res.json({
      success: true,
      file: {
        key: req.file.key,
        location: req.file.location,
        originalname: req.file.originalname,
        size: req.file.size,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Stripe checkout session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { planId, userId, userEmail } = req.body;

    const plans = {
      'starter-monthly': { priceId: process.env.STRIPE_STARTER_PRICE_ID, name: 'Starter Monthly' },
      'pro-monthly': { priceId: process.env.STRIPE_PRO_PRICE_ID, name: 'Pro Monthly' },
      'team-monthly': { priceId: process.env.STRIPE_TEAM_PRICE_ID, name: 'Team Monthly' },
    };

    const plan = plans[planId];
    if (!plan) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    let customer;
    const { data: user } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    if (user?.stripe_customer_id) {
      customer = await stripe.customers.retrieve(user.stripe_customer_id);
    } else {
      customer = await stripe.customers.create({
        email: userEmail,
      });

      await supabase
        .from('users')
        .update({ stripe_customer_id: customer.id })
        .eq('id', userId);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [{ price: plan.priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&plan=${planId}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing?canceled=true`,
      metadata: { userId, planName: plan.name },
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Razorpay order creation
app.post('/api/create-razorpay-order', async (req, res) => {
  try {
    const { planId, userId } = req.body;

    const plans = {
      'starter-monthly': { amount: 59900, name: 'Starter Monthly' }, // ₹599
      'pro-monthly': { amount: 149900, name: 'Pro Monthly' }, // ₹1499
      'team-monthly': { amount: 399900, name: 'Team Monthly' }, // ₹3999
    };

    const plan = plans[planId];
    if (!plan) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    const options = {
      amount: plan.amount,
      currency: 'INR',
      receipt: `receipt_${userId}_${Date.now()}`,
      notes: {
        userId,
        planName: plan.name,
        planId,
      },
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Razorpay order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Razorpay payment verification
app.post('/api/verify-razorpay-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, planId } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Update user subscription
      const plans = {
        'starter-monthly': { name: 'starter', minutes: 60 },
        'pro-monthly': { name: 'pro', minutes: 150 },
        'team-monthly': { name: 'team', minutes: 400 },
      };

      const plan = plans[planId];
      await supabase
        .from('users')
        .update({
          subscription_plan: plan.name,
          credits: plan.minutes,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// Stripe webhooks
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const userId = session.metadata.userId;
        const planName = session.metadata.planName;

        const planLimits = {
          'Starter Monthly': { name: 'starter', minutes: 60 },
          'Pro Monthly': { name: 'pro', minutes: 150 },
          'Team Monthly': { name: 'team', minutes: 400 },
        };

        const plan = planLimits[planName];
        if (plan) {
          await supabase
            .from('users')
            .update({
              subscription_plan: plan.name,
              credits: plan.minutes,
              updated_at: new Date().toISOString()
            })
            .eq('id', userId);
        }
        break;

      case 'invoice.payment_succeeded':
        // Handle successful subscription renewal
        break;

      case 'invoice.payment_failed':
        // Handle failed payment
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Return a presigned PUT URL for client uploads
app.get('/api/s3/sign', verifyFirebaseToken, async (req, res) => {
  try {
    const { filename, contentType, userId } = req.query;
    if (!filename) return res.status(400).json({ error: 'filename required' });
    const key = `uploads/${userId || 'anonymous'}/${Date.now()}_${String(filename)}`;
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Expires: 60 * 10,
      ContentType: contentType || 'application/octet-stream',
      ACL: 'private',
    };
    const url = s3.getSignedUrl('putObject', params);
    res.json({ url, key, bucket: process.env.AWS_S3_BUCKET });
  } catch (err) {
    console.error('Presign error', err);
    res.status(500).json({ error: 'Failed to generate presigned url' });
  }
});

app.get('/api/s3/url', verifyFirebaseToken, async (req, res) => {
  try {
    const { key, expiresIn } = req.query;
    if (!key) return res.status(400).json({ error: 'key required' });
    const url = s3.getSignedUrl('getObject', { Bucket: process.env.AWS_S3_BUCKET, Key: String(key), Expires: Number(expiresIn) || 3600 });
    res.json({ url });
  } catch (err) {
    console.error('Get URL error', err);
    res.status(500).json({ error: 'Failed to get url' });
  }
});

app.post('/api/s3/delete', verifyFirebaseToken, express.json(), async (req, res) => {
  try {
    const { key } = req.body;
    if (!key) return res.status(400).json({ error: 'key required' });
    await s3.deleteObject({ Bucket: process.env.AWS_S3_BUCKET, Key: key }).promise();
    res.json({ success: true });
  } catch (err) {
    console.error('Delete error', err);
    res.status(500).json({ error: 'Failed to delete' });
  }
});

// Multer memory storage for direct uploads to server
const memoryUpload = multer({ storage: multer.memoryStorage() });

// Transcription endpoint — accepts s3Key or multipart file; server calls OpenAI
app.post('/api/transcribe', verifyFirebaseToken, memoryUpload.single('file'), async (req, res) => {
  try {
    const { s3Key, language } = req.body;
    let key = s3Key;
    let originalFilename = '';

    if (!key && req.file) {
      // upload buffer to S3
      originalFilename = req.file.originalname || `upload_${Date.now()}`;
      const uploadKey = `uploads/${req.user?.uid || 'anonymous'}/${Date.now()}_${originalFilename}`;
      await s3.putObject({ Bucket: process.env.AWS_S3_BUCKET, Key: uploadKey, Body: req.file.buffer, ContentType: req.file.mimetype, ACL: 'private' }).promise();
      key = uploadKey;
    }

    if (!key) return res.status(400).json({ error: 'No file provided' });

    // Call OpenAI Whisper transcription (server-side)
    const form = new FormData();
    // fetch the object from S3 as stream
    const s3Stream = s3.getObject({ Bucket: process.env.AWS_S3_BUCKET, Key: key }).createReadStream();
    form.append('file', s3Stream, originalFilename || 'audio');
    form.append('model', 'whisper-1');
    if (language) form.append('language', language);

    const openaiResp = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: form,
    });

    if (!openaiResp.ok) {
      const text = await openaiResp.text();
      console.error('OpenAI error', text);
      return res.status(502).json({ error: 'Transcription failed' });
    }

    const data = await openaiResp.json();

    // Persist transcription into Supabase (if available)
    try {
      const userId = req.user?.uid || req.body.userId;
      await supabase.from('transcriptions').insert({ user_id: userId || null, filename: key, original_filename: originalFilename, s3_key: key, transcript: data.text, language: data.language || null, duration: data.duration || null, status: 'completed' });
    } catch (dbErr) {
      console.error('Supabase insert error', dbErr);
    }

    res.json({ text: data.text, language: data.language, duration: data.duration });
  } catch (err) {
    console.error('Transcription endpoint error', err);
    res.status(500).json({ error: 'Transcription failed' });
  }
});