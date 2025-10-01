import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';

interface MobileSearchScreenProps {
  onNavigate: (page: string, params?: any) => void;
  onPhysiotherapistSelect?: (id: string) => void;
  initialSpecialty?: string;
}

export const MobileSearchScreen = ({ onNavigate, onPhysiotherapistSelect, initialSpecialty }: MobileSearchScreenProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(initialSpecialty || null);
  const [physiotherapists, setPhysiotherapists] = useState<any[]>([]);

  useEffect(() => {
    // Carregar fisioterapeutas do apiService
    const allPhysiotherapists = apiService.getPhysiotherapists();
    console.log('Fisioterapeutas carregados:', allPhysiotherapists);
    setPhysiotherapists(allPhysiotherapists);
  }, []);

  const specialties = [
    { name: 'Ortopedia', icon: '🦴', count: physiotherapists.filter(p => p.specialty === 'Ortopedia').length },
    { name: 'Neurologia', icon: '🧠', count: physiotherapists.filter(p => p.specialty === 'Neurologia').length },
    { name: 'Geriatria', icon: '👴', count: physiotherapists.filter(p => p.specialty === 'Geriatria').length },
    { name: 'Esportiva', icon: '⚽', count: physiotherapists.filter(p => p.specialty === 'Esportiva').length },
    { name: 'RPG', icon: '🧘', count: physiotherapists.filter(p => p.specialty === 'RPG').length },
    { name: 'Pediatria', icon: '👶', count: physiotherapists.filter(p => p.specialty === 'Pediatria').length }
  ];

  const filteredPhysiotherapists = physiotherapists.filter(physio => {
    const matchesSearch = searchTerm === '' || 
      physio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      physio.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = selectedSpecialty === null || 
      physio.specialty === selectedSpecialty;

    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="mobile-container">
      <div className="mobile-safe-area min-h-screen bg-gray-50">
        {/* Status Bar Spacer */}
        <div className="h-2 bg-white"></div>
        
        {/* Header */}
        <div className="bg-white px-4 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">🔍 Buscar</h1>
            <button className="mobile-touch-target bg-gray-100 rounded-full p-2">
              <span className="text-lg">⚙️</span>
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar fisioterapeutas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mobile-input w-full pl-12 pr-4"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>
          
          {/* Location */}
          <div className="flex items-center mt-3 text-sm text-gray-600">
            <span className="mr-2">📍</span>
            <span>São Paulo, SP - Rua das Flores, 123</span>
          </div>
        </div>

        {/* Content */}
        <div className="mobile-scroll flex-1 px-4 py-4 space-y-4 pb-24">
          {/* Specialties Filter */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">Especialidades</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedSpecialty(null)}
                className={`flex items-center justify-between p-3 rounded-lg border-2 transition-colors ${
                  selectedSpecialty === null 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-lg mr-2">🏥</span>
                  <span className="text-sm font-medium">Todas</span>
                </div>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">40</span>
              </button>
              
              {specialties.map((specialty) => (
                <button
                  key={specialty.name}
                  onClick={() => setSelectedSpecialty(specialty.name)}
                  className={`flex items-center justify-between p-3 rounded-lg border-2 transition-colors ${
                    selectedSpecialty === specialty.name 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{specialty.icon}</span>
                    <span className="text-sm font-medium">{specialty.name}</span>
                  </div>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{specialty.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">
                {filteredPhysiotherapists.length} fisioterapeutas encontrados
              </h3>
              {selectedSpecialty && (
                <button
                  onClick={() => setSelectedSpecialty(null)}
                  className="text-blue-600 text-sm font-medium"
                >
                  Limpar
                </button>
              )}
            </div>

            <div className="space-y-3">
              {filteredPhysiotherapists.map((physio) => (
                <div
                  key={physio.id}
                  onClick={() => onPhysiotherapistSelect?.(physio.id)}
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    {physio.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-800">{physio.name}</h4>
                      <div className={`w-3 h-3 rounded-full ${physio.available ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                    </div>
                    <p className="text-sm text-gray-600">{physio.specialty} • {physio.experience}</p>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center">
                        <span className="text-yellow-400 text-sm">⭐</span>
                        <span className="text-sm text-gray-600 ml-1">{physio.rating}</span>
                        <span className="text-gray-400 mx-1">•</span>
                        <span className="text-sm text-gray-600">{(Math.random() * 3 + 0.5).toFixed(1)} km</span>
                      </div>
                      <span className="text-sm font-medium text-green-600">R$ {physio.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredPhysiotherapists.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🔍</div>
                <h4 className="font-medium text-gray-800 mb-1">Nenhum resultado encontrado</h4>
                <p className="text-sm text-gray-600">Tente ajustar sua busca ou filtros</p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[428px] bg-white border-t border-gray-200 px-4 py-2 mobile-safe-area">
          <div className="flex items-center justify-around">
            {[
              { id: 'home', icon: '🏠', label: 'Início', active: false },
              { id: 'search', icon: '🔍', label: 'Buscar', active: true },
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
