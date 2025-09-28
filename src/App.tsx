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
import NotFound from "./pages/NotFound";

type AppScreen = 'splash' | 'onboarding' | 'login' | 'register' | 'home' | 'search' | 'appointments' | 'profile';

const AppContent = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user has seen onboarding
    const onboardingCompleted = localStorage.getItem('fisiovem_onboarding_completed');
    setHasSeenOnboarding(!!onboardingCompleted);
    
    // Check if user is authenticated
    const savedUser = localStorage.getItem('fisiovem_user');
    setIsAuthenticated(!!savedUser);
    
    // Debug: Force onboarding for testing (remove in production)
    console.log('Onboarding completed:', !!onboardingCompleted);
    console.log('User authenticated:', !!savedUser);
  }, []);

  useEffect(() => {
    if (isAuthenticated && currentScreen !== 'home') {
      setCurrentScreen('home');
    }
  }, [isAuthenticated]);

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
    // Simular autenticação
    localStorage.setItem('fisiovem_user', JSON.stringify({
      id: 'user_1',
      name: 'Usuário Teste',
      email: 'teste@email.com'
    }));
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
    // Funcionalidade em desenvolvimento
    alert('Seleção de fisioterapeuta em desenvolvimento!');
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
