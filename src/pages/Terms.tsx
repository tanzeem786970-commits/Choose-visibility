import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground mt-4">Please read these terms carefully before using Tanzify AI.</p>

          <section className="mt-8">
            <h2 className="font-semibold text-xl">Acceptance</h2>
            <p className="text-sm text-muted-foreground mt-2">By using our service you agree to these terms. If you do not agree, do not use Tanzify AI.</p>
          </section>

          <section className="mt-6">
            <h2 className="font-semibold text-xl">Accounts</h2>
            <p className="text-sm text-muted-foreground mt-2">You are responsible for maintaining the security of your account and credentials.</p>
          </section>

          <section className="mt-6">
            <h2 className="font-semibold text-xl">Payments</h2>
            <p className="text-sm text-muted-foreground mt-2">Paid plans are billed as described on the Pricing page. You agree to provide valid payment information.</p>
          </section>

          <section className="mt-6">
            <h2 className="font-semibold text-xl">Refunds</h2>
            <p className="text-sm text-muted-foreground mt-2">Refunds are handled per our refund policy. Contact support for refund requests.</p>
          </section>

          <section className="mt-6">
            <h2 className="font-semibold text-xl">Acceptable Use</h2>
            <p className="text-sm text-muted-foreground mt-2">You must not use the service for illegal content or to infringe others' rights.</p>
          </section>

          <section className="mt-6">
            <h2 className="font-semibold text-xl">Limitation of Liability</h2>
            <p className="text-sm text-muted-foreground mt-2">To the fullest extent permitted by law, Tanzify AI is not liable for indirect or consequential damages.</p>
          </section>

          <div className="mt-8 flex gap-4">
            <Link to="/privacy"><Button>Read Privacy Policy</Button></Link>
            <Link to="/contact"><Button variant="outline">Contact Support</Button></Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
