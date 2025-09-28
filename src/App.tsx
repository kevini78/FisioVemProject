import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SplashScreen } from "@/pages/SplashScreen";
import { OnboardingScreen } from "@/pages/OnboardingScreen";
import { LoginScreen } from "@/pages/LoginScreen";
import { RegisterScreen } from "@/pages/RegisterScreen";
import { SimpleHomeScreen } from "@/pages/SimpleHomeScreen";
import { MobileSearchScreen } from "@/pages/MobileSearchScreen";
import { MobileConsultationsScreen } from "@/pages/MobileConsultationsScreen";
import { MobileProfileScreen } from "@/pages/MobileProfileScreen";
import { BookingScreen } from "@/pages/BookingScreen";
import { apiService } from "@/services/api";
import NotFound from "./pages/NotFound";

type AppScreen = 'splash' | 'onboarding' | 'login' | 'register' | 'home' | 'search' | 'appointments' | 'profile' | 'booking';

const AppContent = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedPhysiotherapistId, setSelectedPhysiotherapistId] = useState<string>('');

  useEffect(() => {
    // Para desenvolvimento: sempre limpar localStorage para ver o fluxo completo
    localStorage.clear();
    
    const onboardingCompleted = localStorage.getItem('fisiovem_onboarding_completed');
    setHasSeenOnboarding(!!onboardingCompleted);

    // NÃO fazer login automático - usuário deve passar pelo fluxo
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated && currentScreen !== 'home' && currentScreen !== 'booking' && currentScreen !== 'appointments' && currentScreen !== 'search' && currentScreen !== 'profile') {
      setCurrentScreen('home');
    }
  }, [isAuthenticated, currentScreen]);

  const handleSplashComplete = () => {
    if (!hasSeenOnboarding) {
      setCurrentScreen('onboarding');
    } else {
      setCurrentScreen(isAuthenticated ? 'home' : 'login');
    }
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('fisiovem_onboarding_completed', 'true');
    setHasSeenOnboarding(true);
    setCurrentScreen(isAuthenticated ? 'home' : 'login');
  };

  const handleLoginSuccess = () => {
    const currentUser = apiService.getCurrentUser();
    if (!currentUser) {
      console.warn('Nenhum usuário encontrado após login/registro.');
      return;
    }

    setIsAuthenticated(true);
    setCurrentScreen('home');
  };

  const handleRegister = () => {
    setCurrentScreen('register');
  };

  const handleNavigate = (screen: AppScreen) => {
    setCurrentScreen(screen);
  };

  const handlePhysiotherapistSelect = (id: string) => {
    setSelectedPhysiotherapistId(id);
    setCurrentScreen('booking');
  };

  // Render current screen
  switch (currentScreen) {
    case 'splash':
      return <SplashScreen onComplete={handleSplashComplete} />;
    
    case 'onboarding':
      return <OnboardingScreen onComplete={handleOnboardingComplete} />;
    
    case 'login':
      return <LoginScreen onSuccess={handleLoginSuccess} onRegister={handleRegister} />;
    
    case 'register':
      return <RegisterScreen onSuccess={handleLoginSuccess} onBack={() => setCurrentScreen('login')} />;
    
    case 'home':
      return (
        <SimpleHomeScreen 
          onNavigate={handleNavigate}
          onPhysiotherapistSelect={handlePhysiotherapistSelect}
        />
      );
    
    case 'search':
      return <MobileSearchScreen onNavigate={handleNavigate} />;
    
    case 'appointments':
      return <MobileConsultationsScreen onNavigate={handleNavigate} />;
    
    case 'profile':
      return <MobileProfileScreen onNavigate={handleNavigate} />;
    
    case 'booking':
      const physiotherapist = apiService.getPhysiotherapistById(selectedPhysiotherapistId);
      if (!physiotherapist) {
        return <div>Fisioterapeuta não encontrado</div>;
      }
      return (
        <BookingScreen 
          physiotherapist={physiotherapist}
          onBack={() => setCurrentScreen('home')}
          onSuccess={() => setCurrentScreen('appointments')}
        />
      );
    
    default:
      return <NotFound />;
  }
};

const App = () => {
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  );
};

export default App;
