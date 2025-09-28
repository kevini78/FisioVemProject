import { apiService } from '@/services/api';

interface SimpleHomeScreenProps {
  onNavigate: (page: string) => void;
  onPhysiotherapistSelect: (id: string) => void;
}

export const SimpleHomeScreen = ({ onNavigate, onPhysiotherapistSelect }: SimpleHomeScreenProps) => {
  return (
    <div className="mobile-container">
      <div className="mobile-safe-area min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        {/* Status Bar Spacer */}
        <div className="h-2 bg-gradient-to-r from-blue-500 to-green-500"></div>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">🏥 FisioVem</h1>
              <p className="text-blue-100 mt-1">Olá! Bem-vindo ao seu app</p>
            </div>
            <button className="mobile-touch-target bg-white/20 rounded-full p-2">
              <span className="text-2xl">🔔</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mobile-scroll flex-1 px-4 py-4 space-y-4 pb-24">
        {/* Welcome Card */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Como podemos ajudá-lo hoje?
          </h2>
          <p className="text-gray-600 mb-4">
            Encontre fisioterapeutas qualificados para atendimento domiciliar.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🏠</div>
            <h3 className="font-semibold mb-1">Atendimento</h3>
            <p className="text-sm opacity-90">Domiciliar</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">📅</div>
            <h3 className="font-semibold mb-1">Agendamento</h3>
            <p className="text-sm opacity-90">Rápido</p>
          </div>
        </div>

          {/* Search */}
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Buscar fisioterapeutas..."
                className="mobile-input w-full pl-12 pr-4"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>
          
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <span className="mr-2">📍</span>
            <span>São Paulo, SP - Rua das Flores, 123</span>
          </div>
        </div>

        {/* Specialties */}
        <div className="bg-white rounded-xl p-4 shadow-lg">
          <h3 className="font-semibold text-gray-800 mb-4">Especialidades</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Ortopedia', icon: '🦴' },
              { name: 'Neurologia', icon: '🧠' },
              { name: 'Geriatria', icon: '👴' },
              { name: 'Esportiva', icon: '⚽' },
              { name: 'RPG', icon: '🧘' },
              { name: 'Pediatria', icon: '👶' }
            ].map((specialty) => (
              <button
                key={specialty.name}
                onClick={() => onPhysiotherapistSelect('demo')}
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <span className="text-xl mr-3">{specialty.icon}</span>
                <span className="text-sm font-medium text-gray-700">{specialty.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Physiotherapists */}
        <div className="bg-white rounded-xl p-4 shadow-lg">
          <h3 className="font-semibold text-gray-800 mb-4">Fisioterapeutas em Destaque</h3>
          <div className="space-y-3">
            {apiService.getPhysiotherapists().slice(0, 3).map((physio) => (
              <div
                key={physio.id}
                onClick={() => onPhysiotherapistSelect(physio.id)}
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  {physio.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{physio.name}</h4>
                  <p className="text-sm text-gray-600">{physio.specialty} • {physio.experience}</p>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center">
                      <span className="text-yellow-400 text-sm">⭐</span>
                      <span className="text-sm text-gray-600 ml-1">{physio.rating}</span>
                    </div>
                    <span className="text-sm font-medium text-green-600">R$ {physio.price}</span>
                  </div>
                </div>
                <div className="text-gray-400">›</div>
              </div>
            ))}
          </div>
        </div>

          {/* Bottom spacing for mobile navigation */}
          <div className="h-4"></div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[428px] bg-white border-t border-gray-200 px-4 py-2 mobile-safe-area">
          <div className="flex items-center justify-around">
            {[
              { id: 'home', icon: '🏠', label: 'Início', active: true },
              { id: 'search', icon: '🔍', label: 'Buscar', active: false },
              { id: 'appointments', icon: '📅', label: 'Consultas', active: false },
              { id: 'profile', icon: '👤', label: 'Perfil', active: false }
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
