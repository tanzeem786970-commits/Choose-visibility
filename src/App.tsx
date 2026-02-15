import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

const Index = React.lazy(() => import("./pages/Index"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Upload = React.lazy(() => import("./pages/Upload"));
const Login = React.lazy(() => import("./pages/Login"));
const Signup = React.lazy(() => import("./pages/Signup"));
const Pricing = React.lazy(() => import("./pages/Pricing"));
const PaymentSuccess = React.lazy(() => import("./pages/PaymentSuccess"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Features = React.lazy(() => import("./pages/Features"));
const HowItWorks = React.lazy(() => import("./pages/HowItWorks"));
const Testimonials = React.lazy(() => import("./pages/Testimonials"));
const Contact = React.lazy(() => import("./pages/Contact"));
const FAQ = React.lazy(() => import("./pages/FAQ"));
const Terms = React.lazy(() => import("./pages/Terms"));
const Privacy = React.lazy(() => import("./pages/Privacy"));
const Refund = React.lazy(() => import("./pages/Refund"));

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-primary-foreground text-primary p-2 rounded">
          Skip to content
        </a>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/features" element={<Features />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/refund" element={<Refund />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
