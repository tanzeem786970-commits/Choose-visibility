import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 container mx-auto px-4 max-w-md">
        <h1 className="font-heading text-3xl font-bold">Forgot Password</h1>
        <p className="text-muted-foreground mt-4">Enter your email to receive a password reset link.</p>

        <form className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input id="email" type="email" placeholder="you@example.com" className="mt-2 w-full p-3 rounded-lg border border-border" />
          </div>
          <div className="flex items-center justify-between">
            <Button type="submit">Send reset link</Button>
            <Link to="/login" className="text-sm text-primary hover:underline">Back to login</Link>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
