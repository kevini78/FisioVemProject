import { useState } from 'react';
import { Eye, EyeOff, Activity, User, Stethoscope, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { UserType } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface RegisterScreenProps {
  onSuccess: () => void;
  onBack: () => void;
}

export const RegisterScreen = ({ onSuccess, onBack }: RegisterScreenProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    specialties: '',
    bio: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState<UserType>('patient');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "As senhas não coincidem.",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        userType,
        ...(userType === 'physiotherapist' && {
          specialties: formData.specialties.split(',').map(s => s.trim()),
          bio: formData.bio,
          pricePerSession: 100,
          rating: 0,
          totalReviews: 0,
          experience: 1,
          credentials: ['CREFITO'],
          availability: [],
          isVerified: false
        })
      };

      const success = await register(userData, userType);
      if (success) {
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Bem-vindo ao FisioVem.",
        });
        onSuccess();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao criar sua conta. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      {/* Header */}
      <div className="flex items-center text-white p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-white hover:bg-white/20 mr-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex justify-center flex-1">
          <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg backdrop-blur-sm">
            <Activity className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="w-9"></div> {/* Spacer for centering */}
      </div>

      <div className="text-center pb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Criar conta</h1>
        <p className="text-white/80">Junte-se à nossa comunidade</p>
      </div>

      {/* Register Form */}
      <div className="flex-1 bg-background rounded-t-3xl px-6 pt-8">
        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                placeholder="Seu nome"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                placeholder="(11) 99999-9999"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              placeholder="Rua, número, bairro, cidade"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              required
              className="h-11"
            />
          </div>

          {/* Physiotherapist specific fields */}
          {userType === 'physiotherapist' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="specialties">Especialidades</Label>
                <Input
                  id="specialties"
                  placeholder="Ortopedia, Neurologia, Geriatria..."
                  value={formData.specialties}
                  onChange={(e) => handleInputChange('specialties', e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Sobre você</Label>
                <Textarea
                  id="bio"
                  placeholder="Conte um pouco sobre sua experiência..."
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="min-h-20"
                />
              </div>
            </>
          )}

          {/* Password */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  className="h-11 pr-11"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                  className="h-11 pr-11"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Register Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-gradient-primary text-base font-medium mt-6"
          >
            {isLoading ? 'Criando conta...' : 'Criar conta'}
          </Button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-6 pb-6">
          <p className="text-muted-foreground">
            Já tem uma conta?{' '}
            <button
              type="button"
              onClick={onBack}
              className="text-primary font-medium hover:underline"
            >
              Faça login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};