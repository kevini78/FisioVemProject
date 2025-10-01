import { useState } from 'react';
import { Eye, EyeOff, Activity } from 'lucide-react';
import { apiService } from '@/services/api';
import { Toast } from '@/components/Toast';

interface LoginScreenProps {
  onSuccess: () => void;
  onRegister: () => void;
}

export const LoginScreen = ({ onSuccess, onRegister }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType] = useState<'patient' | 'physiotherapist'>('patient'); // Sempre paciente
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{message: string; type: 'success' | 'error' | 'info'} | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log('Tentativa de login:', { email, userType });

    try {
      const result = await apiService.login(email, password);
      console.log('Resultado do login:', result);
      
      if (result.success) {
        console.log('Login bem-sucedido, usuário:', result.user);
        onSuccess();
      } else {
        console.log('Erro no login:', result.error);
        setToast({
          message: 'Usuário ou senha inválidos',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Erro inesperado no login:', error);
      setToast({
        message: 'Erro inesperado ao fazer login',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
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
        {/* Status Bar Spacer */}
        <div className="h-2 bg-gradient-hero"></div>
        
        {/* Header */}
        <div className="text-center pt-8 pb-8 px-4">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Activity className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo ao FisioVem</h1>
          <p className="text-white/80 text-lg">Faça login para continuar</p>
        </div>

        {/* Login Form */}
        <div className="flex-1 bg-white rounded-t-3xl px-4 pt-8 mobile-scroll">
               <form onSubmit={handleLogin} className="space-y-6">

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mobile-input w-full"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Senha</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mobile-input w-full pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="mobile-touch-target absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-2"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="mobile-btn w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>


        {/* Register Link */}
        <div className="text-center mt-6 pb-8">
          <p className="text-gray-600">
            Não tem uma conta?{' '}
            <button
              type="button"
              onClick={onRegister}
              className="text-blue-600 font-medium hover:underline mobile-touch-target"
            >
              Cadastre-se
            </button>
          </p>
        </div>
        </div>
      </div>
      </div>
    </>
  );
};