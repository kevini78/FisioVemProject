import { useState } from 'react';
import { Eye, EyeOff, Activity, User, Stethoscope } from 'lucide-react';

interface LoginScreenProps {
  onSuccess: () => void;
  onRegister: () => void;
}

export const LoginScreen = ({ onSuccess, onRegister }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<'patient' | 'physiotherapist'>('patient');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular delay de login
    setTimeout(() => {
      setIsLoading(false);
      
      // Verificar credenciais demo ou qualquer email/senha para teste
      if (email && password) {
        onSuccess();
      } else {
        alert('Por favor, preencha email e senha.');
      }
    }, 1000);
  };

  // Demo credentials helper
  const fillDemoCredentials = (type: 'patient' | 'physiotherapist') => {
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
      <div className="flex-1 bg-white rounded-t-3xl px-6 pt-8">
        <form onSubmit={handleLogin} className="space-y-6">
          {/* User Type Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setUserType('patient')}
              className={`flex flex-col items-center py-4 px-3 rounded-lg border-2 transition-colors ${
                userType === 'patient' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              <User className="w-5 h-5 mb-2" />
              <span className="text-sm font-medium">Paciente</span>
            </button>
            <button
              type="button"
              onClick={() => setUserType('physiotherapist')}
              className={`flex flex-col items-center py-4 px-3 rounded-lg border-2 transition-colors ${
                userType === 'physiotherapist' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              <Stethoscope className="w-5 h-5 mb-2" />
              <span className="text-sm font-medium">Fisioterapeuta</span>
            </button>
          </div>

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
              className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full h-12 px-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
            className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Demo Section */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <h3 className="text-sm font-medium text-center text-gray-700 mb-3">Contas Demo</h3>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => fillDemoCredentials('patient')}
              className="w-full py-2 px-4 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Demo Paciente
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('physiotherapist')}
              className="w-full py-2 px-4 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Demo Fisioterapeuta
            </button>
          </div>
        </div>

        {/* Register Link */}
        <div className="text-center mt-6 pb-6">
          <p className="text-gray-600">
            Não tem uma conta?{' '}
            <button
              type="button"
              onClick={onRegister}
              className="text-blue-600 font-medium hover:underline"
            >
              Cadastre-se
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};