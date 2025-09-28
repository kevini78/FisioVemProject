import { useEffect, useState } from 'react';
import { Activity, Heart } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <div className="relative mb-8">
        <div className="flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl backdrop-blur-sm">
          <Activity className="w-10 h-10 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 animate-pulse">
          <Heart className="w-6 h-6 text-white fill-white" />
        </div>
      </div>

      {/* App Name */}
      <h1 className="text-4xl font-bold text-white mb-2 text-center">
        FisioVem
      </h1>
      
      {/* Tagline */}
      <p className="text-white/90 text-center text-lg mb-12 max-w-sm">
        Fisioterapia no conforto do seu lar
      </p>

      {/* Loading Animation */}
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce"></div>
      </div>

      {/* Bottom text */}
      <div className="absolute bottom-8 text-center">
        <p className="text-white/70 text-sm">
          Conectando você aos melhores fisioterapeutas
        </p>
      </div>
    </div>
  );
};