import { useState, useEffect } from 'react';
import { apiService, Consultation } from '@/services/api';
import { RescheduleModal } from '@/components/RescheduleModal';
import { MobileToast } from '@/components/MobileToast';
import { ConfirmDialog } from '@/components/ConfirmDialog';

interface SimpleConsultationsScreenProps {
  onNavigate: (page: string) => void;
}

export const SimpleConsultationsScreen = ({ onNavigate }: SimpleConsultationsScreenProps) => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rescheduleModal, setRescheduleModal] = useState<{
    isOpen: boolean;
    consultation: Consultation | null;
  }>({ isOpen: false, consultation: null });
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({ message: '', type: 'info', isVisible: false });
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    consultationId: string | null;
  }>({ isOpen: false, consultationId: null });

  useEffect(() => {
    console.log('SimpleConsultationsScreen iniciando...');
    loadConsultations();
  }, []);

  const loadConsultations = async () => {
    try {
      console.log('Carregando consultas...');
      setIsLoading(true);
      setError(null);

      const currentUser = apiService.getCurrentUser();
      console.log('Usuário atual:', currentUser);
      
      if (!currentUser) {
        setError('Usuário não encontrado. Faça login novamente.');
        setConsultations([]);
        return;
      }

      const userConsultations = apiService.getConsultations(currentUser.id);
      console.log('Consultas encontradas:', userConsultations);
      
      // Filtrar apenas consultas a partir de 02/10 (2 dias no futuro)
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const dayAfterTomorrow = new Date(today);
      dayAfterTomorrow.setDate(today.getDate() + 2); // 2 dias no futuro (02/10)
      
      const futureConsultations = userConsultations.filter(c => {
        const consultationDate = new Date(c.date);
        const consultationDateTime = new Date(consultationDate.getFullYear(), consultationDate.getMonth(), consultationDate.getDate());
        
        // Só mostrar consultas a partir de 02/10 (2 dias no futuro) ou consultas já concluídas/canceladas
        return (consultationDateTime >= dayAfterTomorrow) || 
               c.status === 'concluida' || 
               c.status === 'cancelada';
      });
      
      console.log('Consultas futuras filtradas:', futureConsultations);
      setConsultations(futureConsultations || []);
    } catch (error) {
      console.error('Erro ao carregar consultas:', error);
      setError('Erro ao carregar consultas');
      setConsultations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const canCancelOrReschedule = (consultation: any) => {
    // Se a consulta já tem um objeto Date, usar diretamente
    let consultationDateTime;
    if (consultation.date instanceof Date) {
      consultationDateTime = consultation.date;
    } else {
      // Se for string, converter
      consultationDateTime = new Date(`${consultation.date}T${consultation.time}`);
    }
    
    const now = new Date();
    const hoursUntilConsultation = (consultationDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntilConsultation >= 48;
  };

  const handleCancelConsultation = (consultationId: string) => {
    console.log('=== INICIANDO CANCELAMENTO ===');
    console.log('ID da consulta a cancelar:', consultationId);
    
    // Verificar se pode cancelar (24h de antecedência)
    const consultation = consultations.find(c => c.id === consultationId);
    if (consultation) {
      let consultationDateTime;
      if (consultation.date instanceof Date) {
        consultationDateTime = consultation.date;
      } else {
        consultationDateTime = new Date(`${consultation.date}T${consultation.time}`);
      }
      
      const now = new Date();
      const hoursUntilConsultation = (consultationDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
      
      if (hoursUntilConsultation < 48) {
        setToast({
          message: 'Não é possível cancelar consultas com menos de 48 horas de antecedência.',
          type: 'error',
          isVisible: true
        });
        return;
      }
    }
    
    setConfirmDialog({
      isOpen: true,
      consultationId
    });
  };

  const confirmCancelConsultation = async () => {
    if (!confirmDialog.consultationId) return;

    console.log('=== CONFIRMANDO CANCELAMENTO ===');
    console.log('ID da consulta:', confirmDialog.consultationId);

    try {
      const result = await apiService.cancelConsultation(confirmDialog.consultationId);
      console.log('Resultado da API:', result);
      
      if (result.success) {
        console.log('Cancelamento bem-sucedido');
        setToast({
          message: 'Consulta cancelada com sucesso!',
          type: 'success',
          isVisible: true
        });
        loadConsultations(); // Recarregar lista
      } else {
        console.log('Erro no cancelamento:', result.error);
        setToast({
          message: result.error || 'Erro ao cancelar consulta',
          type: 'error',
          isVisible: true
        });
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      setToast({
        message: 'Erro inesperado ao cancelar consulta',
        type: 'error',
        isVisible: true
      });
    } finally {
      setConfirmDialog({ isOpen: false, consultationId: null });
    }
  };

  const handleRescheduleConsultation = (consultationId: string) => {
    const consultation = consultations.find(c => c.id === consultationId);
    if (!consultation) return;

    // Verificar se pode reagendar (24h de antecedência)
    let consultationDateTime;
    if (consultation.date instanceof Date) {
      consultationDateTime = consultation.date;
    } else {
      consultationDateTime = new Date(`${consultation.date}T${consultation.time}`);
    }
    
    const now = new Date();
    const hoursUntilConsultation = (consultationDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilConsultation < 48) {
      setToast({
        message: 'Não é possível reagendar consultas com menos de 48 horas de antecedência.',
        type: 'error',
        isVisible: true
      });
      return;
    }

    setRescheduleModal({
      isOpen: true,
      consultation
    });
  };

  const handleRescheduleConfirm = async (consultationId: string, newDate: string, newTime: string) => {
    try {
      const result = await apiService.updateConsultationDateTime(consultationId, newDate, newTime);
      
      if (result.success) {
        setToast({
          message: 'Consulta reagendada com sucesso!',
          type: 'success',
          isVisible: true
        });
        loadConsultations(); // Recarregar lista
      } else {
        setToast({
          message: result.error || 'Erro ao reagendar consulta',
          type: 'error',
          isVisible: true
        });
      }
    } catch (error) {
      setToast({
        message: 'Erro inesperado ao reagendar consulta',
        type: 'error',
        isVisible: true
      });
    }
  };

  console.log('Renderizando SimpleConsultationsScreen:', { isLoading, error, consultationsCount: consultations.length });

  if (isLoading) {
    return (
      <div className="mobile-container">
        <div className="mobile-safe-area min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-spin">⏳</div>
            <p className="text-gray-600">Carregando suas consultas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mobile-container">
        <div className="mobile-safe-area min-h-screen bg-white flex items-center justify-center">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Erro</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => onNavigate('home')}
              className="mobile-btn bg-blue-600 text-white px-6"
            >
              🏠 Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Toast */}
      <MobileToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />

       {/* Reschedule Modal */}
       {rescheduleModal.consultation && (
         <RescheduleModal
           isOpen={rescheduleModal.isOpen}
           consultation={{
             id: rescheduleModal.consultation.id,
             physiotherapistName: rescheduleModal.consultation.physiotherapistName,
             date: rescheduleModal.consultation.date,
             time: rescheduleModal.consultation.time
           }}
           onClose={() => setRescheduleModal({ isOpen: false, consultation: null })}
           onConfirm={handleRescheduleConfirm}
         />
       )}

       {/* Confirm Cancel Dialog */}
       <ConfirmDialog
         isOpen={confirmDialog.isOpen}
         title="Cancelar Consulta"
         message="Tem certeza que deseja cancelar esta consulta? Esta ação não pode ser desfeita."
         onConfirm={confirmCancelConsultation}
         onCancel={() => setConfirmDialog({ isOpen: false, consultationId: null })}
       />

      <div className="mobile-container">
      <div className="mobile-safe-area min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white px-4 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">📅 Minhas Consultas</h1>
            <button 
              onClick={() => onNavigate('search')}
              className="mobile-btn bg-blue-600 text-white px-4 text-sm"
            >
              + Agendar
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {consultations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Nenhuma consulta agendada
              </h3>
              <p className="text-gray-600 mb-6">
                Que tal agendar uma sessão com um especialista?
              </p>
              <button
                onClick={() => onNavigate('search')}
                className="mobile-btn bg-blue-600 text-white px-6"
              >
                🔍 Buscar Fisioterapeutas
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {consultations.length} consulta{consultations.length !== 1 ? 's' : ''}
              </h2>
              
              {consultations.map((consultation) => (
                <div key={consultation.id} className="bg-white rounded-lg p-4 shadow-sm border">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">
                      {consultation.physiotherapistName}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      consultation.status === 'confirmada' ? 'bg-green-100 text-green-800' :
                      consultation.status === 'agendada' ? 'bg-blue-100 text-blue-800' :
                      consultation.status === 'cancelada' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {consultation.status}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>📅 {new Date(consultation.date).toLocaleDateString('pt-BR')} às {consultation.time}</p>
                    <p>🩺 {consultation.specialty}</p>
                    <p>💰 R$ {consultation.price},00</p>
                    {consultation.type === 'presencial' && consultation.address && (
                      <p>📍 {consultation.address}</p>
                    )}
                  </div>
                  
                  {consultation.status === 'agendada' && (
                    <div className="mt-3 flex gap-2">
                      <button 
                        onClick={() => handleRescheduleConsultation(consultation.id)}
                        className="flex-1 mobile-btn bg-blue-100 text-blue-700 text-sm"
                      >
                        🔄 Reagendar
                      </button>
                      <button 
                        onClick={() => handleCancelConsultation(consultation.id)}
                        className="flex-1 mobile-btn bg-red-100 text-red-700 text-sm"
                      >
                        ❌ Cancelar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Navigation Spacer */}
        <div className="h-20"></div>
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
    </>
  );
};
