import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Refund() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-heading text-3xl font-bold">Refund Policy</h1>
          <p className="text-muted-foreground mt-4">If you are not satisfied within 30 days of purchase, contact support for a full refund.</p>

          <div className="mt-8">
            <Link to="/contact"><Button>Contact Support</Button></Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
