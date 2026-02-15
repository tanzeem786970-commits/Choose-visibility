import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';
import { Check, Zap, Crown, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Features() {
  const features = [
    { title: 'Lightning-fast Transcription', desc: 'Transcribe audio in under 60 seconds with industry-leading accuracy.', icon: Zap },
    { title: 'Multi-language Support', desc: '50+ languages supported with auto-detection and speaker separation.', icon: Users },
    { title: 'Export Everywhere', desc: 'Export transcripts to TXT, SRT, VTT, DOCX, and PDF.', icon: Check },
    { title: 'Team & API', desc: 'Collaboration tools, team plans, and API access for developers.', icon: Crown },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main id="content" className="pt-24 pb-16 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold">Powerful Features for Creators</h1>
          <p className="text-muted-foreground mt-4">Everything you need to transcribe, edit, and publish audio content faster.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
            {features.map((f) => (
              <div key={f.title} className="bg-card rounded-xl p-6 border border-border">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <f.icon aria-hidden={true} className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{f.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center gap-4">
            <Link to="/signup"><Button>Start Free</Button></Link>
            <Link to="/pricing"><Button variant="outline">See Plans</Button></Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
