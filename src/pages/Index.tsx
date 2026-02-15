import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import PricingSection from "@/components/home/PricingSection";
import FAQ from "@/components/home/FAQ";
import CountdownTimer from "@/components/home/CountdownTimer";
import StatsSection from "@/components/home/StatsSection";
import SocialProofNotification from "@/components/home/SocialProofNotification";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <div className="container mx-auto px-4 mt-8">
          <CountdownTimer />
        </div>
        <HowItWorks />
        <StatsSection />
        <Testimonials />
        <PricingSection />
        <FAQ />
      </main>
      <Footer />
      <SocialProofNotification />
    </div>
  );
};

export default Index;
