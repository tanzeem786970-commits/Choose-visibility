import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Users, Zap, Crown } from "lucide-react";

const PricingSection = () => {
  const pricingPlans = [
    {
      name: "Forever Free",
      price: "$0",
      period: "forever",
      minutes: 30,
      features: [
        "30 minutes/month",
        "Basic transcription",
        "Single language",
        "TXT & SRT export",
        "Email support",
      ],
      popular: false,
      cta: "Start Free",
      variant: "outline" as const,
      icon: Sparkles,
    },
    {
      name: "Starter",
      price: "$9.99",
      period: "per month",
      minutes: 300,
      features: [
        "300 minutes/month",
        "Advanced accuracy",
        "50+ languages",
        "All export formats",
        "Priority support",
      ],
      popular: false,
      cta: "Get Started",
      variant: "outline" as const,
      icon: Zap,
    },
    {
      name: "Pro",
      price: "$29.99",
      period: "per month",
      minutes: Infinity,
      features: [
        "Unlimited minutes",
        "Highest accuracy",
        "100+ languages",
        "Team collaboration",
        "Dedicated support",
      ],
      popular: true,
      cta: "Go Pro",
      variant: "default" as const,
      icon: Crown,
    },
    {
      name: "Team",
      price: "$99.99",
      period: "per month",
      minutes: Infinity,
      features: [
        "Everything in Pro",
        "5 team members",
        "Custom branding",
        "API access",
        "24/7 phone support",
      ],
      popular: false,
      cta: "Contact Sales",
      variant: "secondary" as const,
      icon: Users,
    },
  ];

  return (
    <section id="pricing" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Pricing for every creator — transparent, predictable, scalable
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Start free and scale with usage. Annual plans save 20% — no hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-card rounded-2xl p-4 sm:p-6 border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                plan.popular
                  ? "border-primary shadow-glow ring-2 ring-primary"
                  : "border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-4 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-full whitespace-nowrap">
                    🎯 MOST POPULAR
                  </span>
                </div>
              )}

              <div className="mb-6">
                <div className={`w-12 h-12 rounded-xl ${plan.popular ? 'bg-primary/10' : 'bg-muted'} flex items-center justify-center mb-4`}>
                  <plan.icon className={`w-6 h-6 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} aria-hidden={true} />
                </div>
                <h3 className="font-heading text-xl font-bold">{plan.name}</h3>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-2xl sm:text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                {typeof plan.minutes === 'number' && isFinite(plan.minutes) && (
                  <p className="text-sm text-secondary font-medium mt-1">{plan.minutes} minutes included</p>
                )}
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" aria-hidden={true} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/signup" className="block">
                <Button
                  variant={plan.variant}
                  className="w-full"
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-secondary/10 border border-secondary/20 rounded-full">
            <span className="text-secondary font-semibold">💰 30-Day Money-Back Guarantee</span>
            <span className="text-muted-foreground">— Try risk-free</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
