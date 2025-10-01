import { useState } from 'react';
import { Eye, EyeOff, Activity, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { apiService } from '@/services/api';
import { Toast } from '@/components/Toast';
import type { UserType } from '@/services/api';

// Função para validar email
function validarEmail(email: string): boolean {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

// Função para validar senha
function validarSenha(senha: string): boolean {
  // Pelo menos 8 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 especial
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(senha);
}

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
  const [userType] = useState<UserType>('patient'); // Sempre paciente
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{message: string; type: 'success' | 'error' | 'info'} | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação do nome completo (máximo 255 caracteres)
    if (formData.name.length > 255) {
      setToast({
        message: 'O nome completo não pode ter mais de 255 caracteres.',
        type: 'error'
      });
      return;
    }

    // Validação do email
    if (!validarEmail(formData.email)) {
      setToast({
        message: 'Por favor, insira um email válido.',
        type: 'error'
      });
      return;
    }

    // Validação da senha
    if (!validarSenha(formData.password)) {
      setToast({
        message: 'A senha deve ter pelo menos 8 caracteres, incluindo 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial (@$!%*?&).',
        type: 'error'
      });
      return;
    }

    // Validação de senhas coincidentes
    if (formData.password !== formData.confirmPassword) {
      setToast({
        message: 'As senhas não coincidem.',
        type: 'error'
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Tentativa de cadastro:', { 
        email: formData.email, 
        name: formData.name,
        userType 
      });

      const result = await apiService.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        password: formData.password,
        userType
      });

      console.log('Resultado do cadastro:', result);

      if (result.success) {
        console.log('Cadastro bem-sucedido, usuário criado:', result.user);
        setToast({
          message: 'Cadastro realizado com sucesso! Agora você pode fazer login.',
          type: 'success'
        });
        setTimeout(() => {
          onBack(); // Volta para tela de login após mostrar o toast
        }, 2000);
      } else {
        console.log('Erro no cadastro:', result.error);
        setToast({
          message: result.error || 'Erro ao criar conta.',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Erro inesperado no cadastro:', error);
      setToast({
        message: 'Ocorreu um erro inesperado. Tente novamente.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      {toast && (
        <Toast 
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="mobile-container">
        <div className="mobile-safe-area min-h-screen bg-gradient-hero flex flex-col">
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
      <div className="flex-1 bg-background rounded-t-3xl px-6 pt-8 mobile-scroll">
                 <form onSubmit={handleSubmit} className="space-y-4 pb-12">

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
                maxLength={255}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                placeholder="(11) 99999-9999"
                value={formData.phone}
                onChange={(e) => {
                  const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 11);
                  handleInputChange('phone', digitsOnly);
                }}
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
      </div>
    </>
  );
};