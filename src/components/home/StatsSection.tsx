import React from "react";

const StatsSection = () => {
  const stats = [
    { value: "10K+", label: "Happy Users" },
    { value: "1M+", label: "Minutes Transcribed" },
    { value: "4.9/5", label: "Average Rating" },
    { value: "50+", label: "Languages Supported" },
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, idx) => (
            <div key={idx}>
              <p className="font-heading text-3xl sm:text-4xl font-bold gradient-text mb-1">{s.value}</p>
              <p className="text-muted-foreground text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
