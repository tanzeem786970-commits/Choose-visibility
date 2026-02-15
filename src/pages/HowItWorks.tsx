import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';
import { Mic, Zap, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HowItWorks() {
  const steps = [
    { title: 'Upload', desc: 'Drag & drop your audio or browse files (MP3, WAV, M4A, FLAC).', icon: Mic },
    { title: 'Process', desc: 'AI transcribes and separates speakers in under 60 seconds.', icon: Zap },
    { title: 'Export', desc: 'Download transcripts in TXT, SRT, VTT, DOCX or share via link.', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main id="content" className="pt-24 pb-16 container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold">How Tanzify Works</h1>
          <p className="text-muted-foreground mt-4">A simple 3-step flow to get accurate transcripts fast.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
            {steps.map((s) => (
              <div key={s.title} className="bg-card rounded-xl p-6 border border-border text-center">
                <div className="flex items-center justify-center mb-3">
                  <s.icon aria-hidden={true} className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center gap-4">
            <Link to="/upload"><Button>Try It Now</Button></Link>
            <Link to="/pricing"><Button variant="outline">Pricing</Button></Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
