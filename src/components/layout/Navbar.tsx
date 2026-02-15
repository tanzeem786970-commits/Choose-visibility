import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap, Sparkles, User, LogOut } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const [isShrunk, setIsShrunk] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsShrunk(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const baseLinks = [
    { name: 'Features', path: '/features' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Contact', path: '/contact' },
  ];

  const legalLinks = [
    { name: 'Privacy', path: '/privacy' },
    { name: 'Terms', path: '/terms' },
    { name: 'Refund', path: '/refund' },
  ];

  const navLinks = [...baseLinks, ...legalLinks];

  const isActive = (path: string) => {
    try {
      if (path.includes('#')) {
        const [p, hash] = path.split('#');
        const normalizedPath = p || '/';
        return location.pathname === normalizedPath && location.hash === `#${hash}`;
      }
      return location.pathname === path;
    } catch (e) {
      return false;
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isShrunk ? 'h-14' : 'h-16'} shadow-lg`}
      style={{ backgroundColor: 'rgba(255,255,255,0.55)', backdropFilter: 'saturate(180%) blur(8px)' }}
    >
      <div className="container mx-auto px-4">
        <div className="hidden md:grid md:grid-cols-3 items-center" style={{ minHeight: isShrunk ? 56 : 64 }}>
          {/* Left: Logo + LiveCounter */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center transition-transform">
                <Zap className="w-5 h-5 text-primary-foreground" aria-hidden={true} />
              </div>
              <span className="font-heading font-bold text-xl hidden sm:inline-block">
                Tanzify<span className="text-primary">AI</span>
              </span>
            </Link>
          </div>

          {/* Center: Nav Links (centered) */}
          <div className="flex justify-center">
            <div className="flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`group relative text-sm font-medium transition-colors duration-200 ${isActive(link.path) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <span>{link.name}</span>
                  <span className={`absolute left-0 right-0 -bottom-2 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ${isActive(link.path) ? 'scale-x-100' : ''}`} style={{ transformOrigin: 'center' }} />
                </Link>
              ))}
            </div>
          </div>

          {/* Right: CTA / Auth */}
          <div className="flex justify-end items-center gap-4">
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">Log In</Link>
            <Link to="/signup">
              <Button variant="default" size="sm">Start Free Transcription</Button>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden mt-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary-foreground" aria-hidden={true} />
              </div>
            </Link>
          </div>

          <button
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X className="w-6 h-6" aria-hidden={true} /> : <Menu className="w-6 h-6" aria-hidden={true} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-slide-up">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border/50 px-4">
                {user ? (
                  <>
                    <p className="text-sm text-muted-foreground mb-2">Welcome, {user.name || user.email}</p>
                      <Button variant="outline" className="w-full" onClick={() => { logout(); setIsOpen(false); }}>
                      <LogOut className="w-4 h-4 mr-2" aria-hidden={true} />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">Log In</Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsOpen(false)}>
                      <Button className="w-full">Get Started Free</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
