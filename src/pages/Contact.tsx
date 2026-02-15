import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main id="content" className="pt-24 pb-16 container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold">Contact Support</h1>
          <p className="text-muted-foreground mt-4">Have a question or need help? We&apos;re here to help.</p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl p-6 border border-border text-center">
              <Mail aria-hidden={true} className="mx-auto w-6 h-6 text-primary mb-3" />
              <p className="font-semibold">Email Support</p>
              <p className="text-sm text-muted-foreground mt-2">support@tanzify.ai</p>
            </div>
            <div className="bg-card rounded-xl p-6 border border-border text-center">
              <Phone aria-hidden={true} className="mx-auto w-6 h-6 text-primary mb-3" />
              <p className="font-semibold">Sales & Partnerships</p>
              <p className="text-sm text-muted-foreground mt-2">contact@tanzify.ai</p>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm text-muted-foreground">Or send us a message and we&apos;ll reply within 24 hours.</p>
            <div className="mt-4 max-w-xl mx-auto text-left">
              <form className="grid grid-cols-1 gap-3">
                <label htmlFor="contact-name" className="sr-only">Your name</label>
                <input id="contact-name" name="name" className="w-full p-3 border border-border rounded-lg" placeholder="Your name" />
                <label htmlFor="contact-email" className="sr-only">Your email</label>
                <input id="contact-email" name="email" className="w-full p-3 border border-border rounded-lg" placeholder="Your email" />
                <label htmlFor="contact-message" className="sr-only">Message</label>
                <textarea id="contact-message" name="message" className="w-full p-3 border border-border rounded-lg" rows={5} placeholder="How can we help?" />
                <div className="flex justify-end">
                  <Button>Send Message</Button>
                </div>
              </form>
            </div>
          </div>

          <div className="mt-8">
            <Link to="/faq" className="text-primary hover:underline">See FAQs</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
