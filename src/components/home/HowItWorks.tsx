import { Upload, Cpu, Download, ArrowRight } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Upload,
      number: "01",
      title: "Upload Your Audio",
      description:
        "Drag & drop any audio or video file. We accept MP3, WAV, M4A, MP4 and more — files up to 100MB.",
      color: "primary",
    },
    {
      icon: Cpu,
      number: "02",
      title: "AI Transcribes",
      description:
        "Our models quickly transcribe, identify speakers, and add punctuation & timestamps — optimized for production workflows.",
      color: "secondary",
    },
    {
      icon: Download,
      number: "03",
      title: "Edit, Export, Share",
      description:
        "Polish the transcript in-app, export SRT/VTT/TXT/DOCX, or share directly with teammates and CMS integrations.",
      color: "accent",
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "primary":
        return {
          bg: "bg-primary/10",
          border: "border-primary/20",
          icon: "text-primary",
          number: "text-primary",
        };
      case "secondary":
        return {
          bg: "bg-secondary/10",
          border: "border-secondary/20",
          icon: "text-secondary",
          number: "text-secondary",
        };
      case "accent":
        return {
          bg: "bg-accent/10",
          border: "border-accent/20",
          icon: "text-accent",
          number: "text-accent",
        };
      default:
        return {
          bg: "bg-primary/10",
          border: "border-primary/20",
          icon: "text-primary",
          number: "text-primary",
        };
    }
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-medium rounded-full text-sm mb-4">
            Simple 3-Step Flow
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            How <span className="gradient-text">Tanzify AI</span> Delivers Production-Ready Transcripts
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Upload your audio, our AI transcribes and timestamps in seconds, and you get an editable, export-ready transcript with speaker separation and timestamps.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((s) => {
            const Icon: any = s.icon;
            const classes = getColorClasses(s.color as string);
            return (
              <div key={s.number} className={`p-6 border rounded-lg ${classes.bg} ${classes.border}`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-full ${classes.bg} border ${classes.border}`}>
                    <Icon className={`w-6 h-6 ${classes.icon}`} aria-hidden />
                  </div>
                  <div>
                    <div className={`text-sm font-mono ${classes.number}`}>{s.number}</div>
                    <h3 className="text-lg font-semibold">{s.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <a href="/signup" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-md shadow">
            Get Started
            <ArrowRight className="w-4 h-4" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
