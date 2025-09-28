import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';

interface MobileProfileScreenProps {
  onNavigate: (page: string) => void;
}

export const MobileProfileScreen = ({ onNavigate }: MobileProfileScreenProps) => {
  const [user, setUser] = useState<any>(null);
  const [totalConsultations, setTotalConsultations] = useState(0);

  useEffect(() => {
    const currentUser = apiService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      const consultations = apiService.getConsultations(currentUser.id);
      setTotalConsultations(consultations.length);
    }
  }, []);

  if (!user) {
    return (
      <div className="mobile-container">
        <div className="mobile-safe-area min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">👤</div>
            <p className="text-gray-600">Carregando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  const MenuOption = ({ 
    icon, 
    title, 
    subtitle, 
    onClick, 
    rightElement,
    color = 'text-gray-700'
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onClick?: () => void;
    rightElement?: React.ReactNode;
    color?: string;
  }) => (
    <button 
      className="mobile-touch-target w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-lg">{icon}</span>
        </div>
        <div className="text-left">
          <h3 className={`font-medium ${color}`}>{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>
      {rightElement || (
        <div className="text-gray-400">›</div>
      )}
    </button>
  );

  return (
    <div className="mobile-container">
      <div className="mobile-safe-area min-h-screen bg-gray-50">
        {/* Status Bar Spacer */}
        <div className="h-2 bg-white"></div>
        
        {/* Header */}
        <div className="bg-white px-4 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">👤 Perfil</h1>
            <button className="mobile-touch-target bg-gray-100 rounded-full p-2">
              <span className="text-lg">⚙️</span>
            </button>
          </div>
        </div>

        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-green-500 px-4 py-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-sm">📷</span>
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <p className="text-white/80">{user.email}</p>
              <div className="flex items-center mt-2">
                <span className="bg-white/20 px-2 py-1 rounded-full text-xs text-white">
                  Membro desde {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">{totalConsultations}</div>
              <div className="text-sm text-white/80">Consultas</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">{user.userType === 'patient' ? 2 : 5}</div>
              <div className="text-sm text-white/80">Especialidades</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mobile-scroll flex-1 px-4 py-4 space-y-4 pb-24">
          {/* Contact Info */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Informações de Contato</h3>
            </div>
            
            <div className="divide-y divide-gray-100">
              <div className="p-4 flex items-center space-x-3">
                <span className="text-lg">📞</span>
                <div>
                  <p className="text-sm text-gray-500">Telefone</p>
                  <p className="text-gray-800">{user.phone}</p>
                </div>
              </div>
              
              <div className="p-4 flex items-center space-x-3">
                <span className="text-lg">✉️</span>
                <div>
                  <p className="text-sm text-gray-500">E-mail</p>
                  <p className="text-gray-800">{user.email}</p>
                </div>
              </div>
              
              <div className="p-4 flex items-center space-x-3">
                <span className="text-lg">📍</span>
                <div>
                  <p className="text-sm text-gray-500">Endereço</p>
                  <p className="text-gray-800">{user.address || 'Não informado'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Options */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Conta</h3>
            </div>
            
            <div className="divide-y divide-gray-100">
              <MenuOption
                icon="👤"
                title="Editar Perfil"
                subtitle="Altere suas informações pessoais"
                onClick={() => alert('Editar perfil em desenvolvimento')}
              />
              <MenuOption
                icon="🔔"
                title="Notificações"
                subtitle="Gerencie suas preferências"
                rightElement={
                  <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                  </div>
                }
              />
            </div>
          </div>

          {/* Logout */}
          <div className="bg-white rounded-xl shadow-sm">
            <MenuOption
              icon="🚪"
              title="Sair"
              subtitle="Fazer logout da sua conta"
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              color="text-red-600"
            />
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[428px] bg-white border-t border-gray-200 px-4 py-2 mobile-safe-area">
          <div className="flex items-center justify-around">
            {[
              { id: 'home', icon: '🏠', label: 'Início', active: false },
              { id: 'search', icon: '🔍', label: 'Buscar', active: false },
              { id: 'appointments', icon: '📅', label: 'Consultas', active: false },
              { id: 'profile', icon: '👤', label: 'Perfil', active: true }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`mobile-touch-target flex flex-col items-center py-2 px-3 rounded-lg transition-all ${
                  item.active 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl mb-1">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
