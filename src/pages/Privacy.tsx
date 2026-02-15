import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground mt-4">Your privacy matters to us. This policy explains what data we collect and how we use it.</p>

          <section className="mt-8">
            <h2 className="font-semibold text-xl">Data We Collect</h2>
            <p className="text-sm text-muted-foreground mt-2">We collect information you provide (account details, email), files you upload for transcription, and analytics data to improve our service.</p>
          </section>

          <section className="mt-6">
            <h2 className="font-semibold text-xl">How We Use Data</h2>
            <p className="text-sm text-muted-foreground mt-2">We process uploaded audio to provide transcripts, send transactional emails, and improve model performance. We never share your private audio with third parties without consent.</p>
          </section>

          <section className="mt-6">
            <h2 className="font-semibold text-xl">Retention & Deletion</h2>
            <p className="text-sm text-muted-foreground mt-2">By default, uploaded audio and derived transcripts are retained for 7 days. You can request permanent deletion by contacting support.</p>
          </section>

          <section className="mt-6">
            <h2 className="font-semibold text-xl">Security</h2>
            <p className="text-sm text-muted-foreground mt-2">We use industry-standard encryption in transit and at rest. Access to production keys is limited; sensitive operations are server-side only.</p>
          </section>

          <section className="mt-6">
            <h2 className="font-semibold text-xl">Your Rights</h2>
            <p className="text-sm text-muted-foreground mt-2">You can request a copy of your data, corrections, or deletion by contacting support.</p>
          </section>

          <div className="mt-8 flex gap-4">
            <Link to="/contact"><Button>Contact Support</Button></Link>
            <Link to="/signup"><Button variant="outline">Create Account</Button></Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
