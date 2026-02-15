import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FAQComponent from '@/components/home/FAQ';

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <FAQComponent />
      </main>
      <Footer />
    </div>
  );
}
