import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Page404() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 container mx-auto px-4 text-center">
        <h1 className="font-heading text-5xl font-bold">404</h1>
        <p className="text-muted-foreground mt-4">Page not found.</p>
        <div className="mt-6 flex justify-center gap-4">
          <Link to="/"><Button>Go home</Button></Link>
          <Link to="/contact"><Button variant="outline">Contact Support</Button></Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
