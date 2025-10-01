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
import { SimpleConsultationsScreen } from "@/pages/SimpleConsultationsScreen";
import { MobileProfileScreen } from "@/pages/MobileProfileScreen";
import { BookingScreen } from "@/pages/BookingScreen";
import { BookingSuccessScreen } from "@/pages/BookingSuccessScreen";
import { apiService } from "@/services/api";
import NotFound from "./pages/NotFound";

type AppScreen = 'splash' | 'onboarding' | 'login' | 'register' | 'home' | 'search' | 'appointments' | 'profile' | 'booking' | 'booking-success';

const AppContent = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedPhysiotherapistId, setSelectedPhysiotherapistId] = useState<string>('');
  const [searchParams, setSearchParams] = useState<any>(null);

  useEffect(() => {
    // Para desenvolvimento: limpar apenas onboarding para ver o fluxo completo
    // Mas manter usuários criados e outras configurações
    localStorage.removeItem('fisiovem_onboarding_completed');
    localStorage.removeItem('fisiovem_current_user');
    
    const onboardingCompleted = localStorage.getItem('fisiovem_onboarding_completed');
    setHasSeenOnboarding(!!onboardingCompleted);

    // NÃO fazer login automático - usuário deve passar pelo fluxo
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated && currentScreen !== 'home' && currentScreen !== 'booking' && currentScreen !== 'appointments' && currentScreen !== 'search' && currentScreen !== 'profile' && currentScreen !== 'booking-success') {
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

  const handleNavigate = (screen: AppScreen, params?: any) => {
    setCurrentScreen(screen);
    setSearchParams(params);
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
      return <MobileSearchScreen 
        onNavigate={handleNavigate} 
        onPhysiotherapistSelect={handlePhysiotherapistSelect}
        initialSpecialty={searchParams?.specialty}
      />;
    
    case 'appointments':
      return <SimpleConsultationsScreen onNavigate={handleNavigate} />;
    
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
          onSuccess={() => setCurrentScreen('booking-success')}
        />
      );
    
    case 'booking-success':
      return (
        <BookingSuccessScreen 
          onGoHome={() => setCurrentScreen('home')}
          onViewConsultations={() => setCurrentScreen('appointments')}
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
