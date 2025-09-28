import { useState, useEffect } from 'react';
import { apiService, Consultation } from '@/services/api';

interface MobileConsultationsScreenProps {
  onNavigate: (page: string) => void;
}

export const MobileConsultationsScreen = ({ onNavigate }: MobileConsultationsScreenProps) => {
  const [activeTab, setActiveTab] = useState('proximas');
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConsultations();
  }, []);

  const loadConsultations = () => {
    const currentUser = apiService.getCurrentUser();
    if (currentUser) {
      const userConsultations = apiService.getConsultations(currentUser.id);
      setConsultations(userConsultations);
    }
    setIsLoading(false);
  };

  const handleCancelConsultation = async (consultationId: string) => {
    if (!confirm('Tem certeza que deseja cancelar esta consulta?')) {
      return;
    }

    const result = await apiService.cancelConsultation(consultationId);
    if (result.success) {
      alert('Consulta cancelada com sucesso!');
      loadConsultations();
    } else {
      alert(result.error || 'Erro ao cancelar consulta');
    }
  };

  const handleConfirmConsultation = async (consultationId: string) => {
    const result = await apiService.updateConsultationStatus(consultationId, 'confirmada');
    if (result.success) {
      alert('Consulta confirmada!');
      loadConsultations();
    } else {
      alert(result.error || 'Erro ao confirmar consulta');
    }
  };

  const getFilteredConsultations = () => {
    const now = new Date();
    
    if (activeTab === 'proximas') {
      return consultations.filter(c => 
        c.status === 'agendada' || c.status === 'confirmada' || 
        (new Date(c.date) >= now && c.status !== 'cancelada' && c.status !== 'concluida')
      );
    } else {
      return consultations.filter(c => 
        c.status === 'concluida' || c.status === 'cancelada' ||
        (new Date(c.date) < now && c.status !== 'agendada' && c.status !== 'confirmada')
      );
    }
  };

  const filteredConsultations = getFilteredConsultations();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmada':
        return 'bg-green-100 text-green-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'concluida':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmada':
        return 'Confirmada';
      case 'pendente':
        return 'Pendente';
      case 'concluida':
        return 'Concluída';
      default:
        return status;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const ConsultationCard = ({ consultation }: { consultation: any }) => (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white font-semibold">
            {consultation.physiotherapistName.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">
              {consultation.physiotherapistName}
            </h3>
            <p className="text-sm text-gray-600">{consultation.specialty}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
          {getStatusText(consultation.status)}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <span className="mr-2">📅</span>
          <span>{formatDate(consultation.date)} às {consultation.time}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <span className="mr-2">{consultation.type === 'presencial' ? '🏠' : '💻'}</span>
          <span>
            {consultation.type === 'presencial' 
              ? consultation.address || 'Atendimento domiciliar'
              : 'Consulta online'
            }
          </span>
        </div>

        {consultation.rating && (
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">⭐</span>
            <span>Avaliação: {consultation.rating}/5</span>
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        {consultation.status === 'confirmada' && (
          <>
            <button className="mobile-btn flex-1 bg-blue-600 text-white">
              {consultation.type === 'online' ? '💻 Entrar' : '📍 Ver Local'}
            </button>
            <button className="mobile-btn px-4 bg-gray-100 text-gray-700">
              📞
            </button>
          </>
        )}
        
        {consultation.status === 'pendente' && (
          <>
            <button className="mobile-btn flex-1 bg-green-600 text-white">
              ✅ Confirmar
            </button>
            <button className="mobile-btn flex-1 bg-red-600 text-white">
              ❌ Cancelar
            </button>
          </>
        )}
        
        {consultation.status === 'concluida' && (
          <>
            <button className="mobile-btn flex-1 bg-gray-100 text-gray-700">
              📋 Ver Detalhes
            </button>
            <button className="mobile-btn flex-1 bg-blue-100 text-blue-700">
              🔄 Reagendar
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="mobile-container">
      <div className="mobile-safe-area min-h-screen bg-gray-50">
        {/* Status Bar Spacer */}
        <div className="h-2 bg-white"></div>
        
        {/* Header */}
        <div className="bg-white px-4 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">📅 Consultas</h1>
            <button className="mobile-btn bg-blue-600 text-white px-4">
              + Agendar
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-blue-500 to-green-500 px-4 py-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/20 rounded-lg p-3">
              <div className="text-2xl font-bold text-white">
                {consultations.proximas.length}
              </div>
              <div className="text-sm text-white/80">Próximas</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <div className="text-2xl font-bold text-white">
                {consultations.concluidas.length}
              </div>
              <div className="text-sm text-white/80">Concluídas</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <div className="text-2xl font-bold text-white">
                4.8
              </div>
              <div className="text-sm text-white/80">Avaliação</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('proximas')}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                activeTab === 'proximas'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Próximas ({consultations.proximas.length})
            </button>
            <button
              onClick={() => setActiveTab('concluidas')}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                activeTab === 'concluidas'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Concluídas ({consultations.concluidas.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mobile-scroll flex-1 px-4 py-4 space-y-4 pb-24">
          {activeTab === 'proximas' && (
            <div className="space-y-4">
              {consultations.proximas.length > 0 ? (
                consultations.proximas.map(consultation => (
                  <ConsultationCard key={consultation.id} consultation={consultation} />
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📅</div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Nenhuma consulta agendada</h3>
                  <p className="text-gray-600 mb-4">Que tal agendar uma sessão?</p>
                  <button className="mobile-btn bg-blue-600 text-white px-6">
                    + Agendar Consulta
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'concluidas' && (
            <div className="space-y-4">
              {consultations.concluidas.map(consultation => (
                <ConsultationCard key={consultation.id} consultation={consultation} />
              ))}
            </div>
          )}
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[428px] bg-white border-t border-gray-200 px-4 py-2 mobile-safe-area">
          <div className="flex items-center justify-around">
            {[
              { id: 'home', icon: '🏠', label: 'Início', active: false },
              { id: 'search', icon: '🔍', label: 'Buscar', active: false },
              { id: 'appointments', icon: '📅', label: 'Consultas', active: true },
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
