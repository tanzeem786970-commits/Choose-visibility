import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TestimonialsComponent from '@/components/home/Testimonials';

export default function Testimonials() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <TestimonialsComponent />
      </main>
      <Footer />
    </div>
  );
}
