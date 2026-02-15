import { useState, useEffect } from "react";
import { Users, Zap } from "lucide-react";

const LiveCounter = () => {
  const [userCount, setUserCount] = useState(234);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setUserCount((prev) => prev + Math.floor(Math.random() * 3));
      setTimeout(() => setIsAnimating(false), 500);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-full">
      <div className="relative">
        <div className="w-2.5 h-2.5 bg-secondary rounded-full animate-pulse" />
        <div className="absolute inset-0 w-2.5 h-2.5 bg-secondary rounded-full animate-ping opacity-75" />
      </div>
      <span className="flex items-center gap-1.5 text-sm font-medium text-secondary">
        <Users className="w-4 h-4" aria-hidden={true} />
        <span className={`transition-all duration-300 ${isAnimating ? 'animate-counter' : ''}`}>
          {userCount.toLocaleString()}
        </span>
        users transcribing now
        <Zap className="w-3.5 h-3.5 text-accent" aria-hidden={true} />
      </span>
    </div>
  );
};

export default LiveCounter;
