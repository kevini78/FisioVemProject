import { useState } from 'react';
import { Eye, EyeOff, Activity, User, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { UserType } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface LoginScreenProps {
  onSuccess: () => void;
  onRegister: () => void;
}

export const LoginScreen = ({ onSuccess, onRegister }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<UserType>('patient');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password, userType);
      if (success) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta ao FisioVem.",
        });
        onSuccess();
      } else {
        toast({
          variant: "destructive",
          title: "Erro no login",
          description: "Email ou senha incorretos. Tente novamente.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro inesperado. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Demo credentials helper
  const fillDemoCredentials = (type: UserType) => {
    if (type === 'patient') {
      setEmail('maria.silva@email.com');
      setPassword('demo123');
    } else {
      setEmail('ana.beatriz@fisiovem.com');
      setPassword('demo123');
    }
    setUserType(type);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      {/* Header */}
      <div className="text-center pt-12 pb-8">
        <div className="flex justify-center mb-4">
          <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-xl backdrop-blur-sm">
            <Activity className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Bem-vindo de volta</h1>
        <p className="text-white/80">Faça login para continuar</p>
      </div>

      {/* Login Form */}
      <div className="flex-1 bg-background rounded-t-3xl px-6 pt-8">
        <form onSubmit={handleLogin} className="space-y-6">
          {/* User Type Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button
              type="button"
              variant={userType === 'patient' ? 'default' : 'outline'}
              onClick={() => setUserType('patient')}
              className="flex flex-col h-auto py-4 gap-2"
            >
              <User className="w-5 h-5" />
              <span className="text-sm">Paciente</span>
            </Button>
            <Button
              type="button"
              variant={userType === 'physiotherapist' ? 'default' : 'outline'}
              onClick={() => setUserType('physiotherapist')}
              className="flex flex-col h-auto py-4 gap-2"
            >
              <Stethoscope className="w-5 h-5" />
              <span className="text-sm">Fisioterapeuta</span>
            </Button>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 text-base"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 text-base pr-12"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-gradient-primary text-base font-medium"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        {/* Demo Section */}
        <Card className="mt-6 bg-muted/50 border-dashed">
          <CardHeader>
            <h3 className="text-sm font-medium text-center">Contas Demo</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => fillDemoCredentials('patient')}
              className="w-full text-sm"
            >
              Demo Paciente
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => fillDemoCredentials('physiotherapist')}
              className="w-full text-sm"
            >
              Demo Fisioterapeuta
            </Button>
          </CardContent>
        </Card>

        {/* Register Link */}
        <div className="text-center mt-6 pb-6">
          <p className="text-muted-foreground">
            Não tem uma conta?{' '}
            <button
              type="button"
              onClick={onRegister}
              className="text-primary font-medium hover:underline"
            >
              Cadastre-se
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};