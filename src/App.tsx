import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { SplashScreen } from "@/pages/SplashScreen";
import { OnboardingScreen } from "@/pages/OnboardingScreen";
import { LoginScreen } from "@/pages/LoginScreen";
import { RegisterScreen } from "@/pages/RegisterScreen";
import { HomeScreen } from "@/pages/HomeScreen";
import { PhysiotherapistProfile } from "@/pages/PhysiotherapistProfile";
import { AppointmentBooking } from "@/pages/AppointmentBooking";
import { SearchScreen } from "@/pages/SearchScreen";
import { ConsultationsScreen } from "@/pages/ConsultationsScreen";
import { EvaluationsScreen } from "@/pages/EvaluationsScreen";
import { ProfileScreen } from "@/pages/ProfileScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

type AppScreen = 'splash' | 'onboarding' | 'login' | 'register' | 'home' | 'search' | 'appointments' | 'reviews' | 'profile' | 'physio-profile' | 'appointment';

const AppContent = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [selectedPhysiotherapistId, setSelectedPhysiotherapistId] = useState<string>('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Check if user has seen onboarding
    const onboardingCompleted = localStorage.getItem('fisiovem_onboarding_completed');
    setHasSeenOnboarding(!!onboardingCompleted);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
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
    setCurrentScreen('physio-profile');
  };

  const handleBookAppointment = (physiotherapistId: string) => {
    setSelectedPhysiotherapistId(physiotherapistId);
    setCurrentScreen('appointment');
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
        <HomeScreen 
          onNavigate={handleNavigate}
          onPhysiotherapistSelect={handlePhysiotherapistSelect}
        />
      );
    
    case 'physio-profile':
      return (
        <PhysiotherapistProfile
          physiotherapistId={selectedPhysiotherapistId}
          onBack={() => setCurrentScreen('home')}
          onBookAppointment={handleBookAppointment}
        />
      );
    
    case 'appointment':
      return (
        <AppointmentBooking
          physiotherapistId={selectedPhysiotherapistId}
          onBack={() => setCurrentScreen('physio-profile')}
          onSuccess={() => setCurrentScreen('home')}
        />
      );
    
    case 'search':
      return <SearchScreen />;
    
    case 'appointments':
      return <ConsultationsScreen />;
    
    case 'reviews':
      return <EvaluationsScreen />;
    
    case 'profile':
      return <ProfileScreen />;
    
    default:
      return <NotFound />;
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
