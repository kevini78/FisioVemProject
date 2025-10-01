import { useState } from 'react';
import { apiService, Physiotherapist } from '@/services/api';

interface BookingScreenProps {
  physiotherapist: Physiotherapist;
  onBack: () => void;
  onSuccess: () => void;
}

export const BookingScreen = ({ physiotherapist, onBack, onSuccess }: BookingScreenProps) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [consultationType, setConsultationType] = useState<'presencial' | 'online'>('presencial');
  const [addressStreet, setAddressStreet] = useState('');
  const [addressNumber, setAddressNumber] = useState('');
  const [addressNeighborhood, setAddressNeighborhood] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressState, setAddressState] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const getNextDays = (count: number) => {
    const days = [];
    // Começar a partir de 02/10 (2 dias no futuro)
    for (let i = 2; i <= count + 1; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('pt-BR', { 
          weekday: 'short', 
          day: 'numeric', 
          month: 'short' 
        })
      });
    }
    return days;
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      alert('Por favor, selecione data e horário');
      return;
    }

    // Verificar se a consulta é com pelo menos 48h de antecedência (2 dias)
    const consultationDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const now = new Date();
    const hoursUntilConsultation = (consultationDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilConsultation < 48) {
      alert('Não é possível agendar consultas com menos de 48 horas de antecedência.');
      return;
    }

    if (consultationType === 'presencial') {
      if (!addressStreet || !addressNumber || !addressNeighborhood || !addressCity || !addressState) {
        alert('Por favor, preencha todos os campos de endereço');
        return;
      }
    }

    setIsLoading(true);

    try {
      const currentUser = apiService.getCurrentUser();
      if (!currentUser) {
        alert('Usuário não encontrado');
        return;
      }

      const result = await apiService.bookConsultation({
        patientId: currentUser.id,
        physiotherapistId: physiotherapist.id,
        physiotherapistName: physiotherapist.name,
        date: selectedDate,
        time: selectedTime,
        type: consultationType,
        specialty: physiotherapist.specialty,
        address: consultationType === 'presencial' ? `${addressStreet}, ${addressNumber} - ${addressNeighborhood}` : undefined,
        city: consultationType === 'presencial' ? addressCity : undefined,
        state: consultationType === 'presencial' ? addressState : undefined,
        price: physiotherapist.price,
        notes
      });

      if (result.success) {
        onSuccess(); // Vai direto para tela de sucesso
      } else {
        alert(result.error || 'Erro ao agendar consulta');
      }
    } catch (error) {
      alert('Erro inesperado ao agendar consulta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mobile-container">
      <div className="mobile-safe-area min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white px-4 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <button 
              onClick={onBack}
              className="mobile-touch-target p-2 -ml-2"
            >
              <span className="text-xl">←</span>
            </button>
            <h1 className="text-xl font-bold text-gray-800">Agendar Consulta</h1>
          </div>
        </div>

        {/* Physiotherapist Info */}
        <div className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {physiotherapist.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-800">{physiotherapist.name}</h2>
              <p className="text-gray-600">{physiotherapist.specialty} • {physiotherapist.experience}</p>
              <div className="flex items-center mt-1">
                <span className="text-yellow-400">⭐</span>
                <span className="text-sm text-gray-600 ml-1">{physiotherapist.rating}</span>
                <span className="text-sm font-medium text-green-600 ml-3">R$ {physiotherapist.price}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="px-4 py-4 space-y-4">
          {/* Date Selection */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">Escolha a Data</h3>
            <div className="grid grid-cols-3 gap-2">
              {getNextDays(9).map((day) => (
                <button
                  key={day.value}
                  onClick={() => setSelectedDate(day.value)}
                  className={`mobile-btn p-3 text-sm ${
                    selectedDate === day.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">Escolha o Horário</h3>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`mobile-btn p-3 text-sm ${
                    selectedTime === time
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Consultation Type */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">Tipo de Consulta</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setConsultationType('presencial')}
                className={`mobile-btn p-4 flex flex-col items-center ${
                  consultationType === 'presencial'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-2xl mb-2">🏠</span>
                <span className="font-medium">Presencial</span>
                <span className="text-xs opacity-80">Atendimento domiciliar</span>
              </button>
              <button
                onClick={() => setConsultationType('online')}
                className={`mobile-btn p-4 flex flex-col items-center ${
                  consultationType === 'online'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-2xl mb-2">💻</span>
                <span className="font-medium">Online</span>
                <span className="text-xs opacity-80">Videochamada</span>
              </button>
            </div>
          </div>

          {/* Address (only for presencial) */}
          {consultationType === 'presencial' && (
            <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
              <h3 className="font-semibold text-gray-800">Endereço para Atendimento</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700">Rua</label>
                  <input
                    type="text"
                    value={addressStreet}
                    onChange={(e) => setAddressStreet(e.target.value)}
                    placeholder="Nome da rua"
                    className="mobile-input w-full"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Número</label>
                  <input
                    type="text"
                    value={addressNumber}
                    onChange={(e) => {
                      // Permitir apenas números
                      const numbersOnly = e.target.value.replace(/\D/g, '');
                      setAddressNumber(numbersOnly);
                    }}
                    placeholder="Nº"
                    className="mobile-input w-full"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Bairro</label>
                  <input
                    type="text"
                    value={addressNeighborhood}
                    onChange={(e) => setAddressNeighborhood(e.target.value)}
                    placeholder="Bairro"
                    className="mobile-input w-full"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Cidade</label>
                  <input
                    type="text"
                    value={addressCity}
                    onChange={(e) => setAddressCity(e.target.value)}
                    placeholder="Cidade"
                    className="mobile-input w-full"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Estado</label>
                  <select
                    value={addressState}
                    onChange={(e) => setAddressState(e.target.value)}
                    className="mobile-input w-full"
                  >
                    <option value="">Selecione</option>
                    <option value="Acre">Acre</option>
                    <option value="Alagoas">Alagoas</option>
                    <option value="Amapá">Amapá</option>
                    <option value="Amazonas">Amazonas</option>
                    <option value="Bahia">Bahia</option>
                    <option value="Ceará">Ceará</option>
                    <option value="Distrito Federal">Distrito Federal</option>
                    <option value="Espírito Santo">Espírito Santo</option>
                    <option value="Goiás">Goiás</option>
                    <option value="Maranhão">Maranhão</option>
                    <option value="Mato Grosso">Mato Grosso</option>
                    <option value="Mato Grosso do Sul">Mato Grosso do Sul</option>
                    <option value="Minas Gerais">Minas Gerais</option>
                    <option value="Pará">Pará</option>
                    <option value="Paraíba">Paraíba</option>
                    <option value="Paraná">Paraná</option>
                    <option value="Pernambuco">Pernambuco</option>
                    <option value="Piauí">Piauí</option>
                    <option value="Rio de Janeiro">Rio de Janeiro</option>
                    <option value="Rio Grande do Norte">Rio Grande do Norte</option>
                    <option value="Rio Grande do Sul">Rio Grande do Sul</option>
                    <option value="Rondônia">Rondônia</option>
                    <option value="Roraima">Roraima</option>
                    <option value="Santa Catarina">Santa Catarina</option>
                    <option value="São Paulo">São Paulo</option>
                    <option value="Sergipe">Sergipe</option>
                    <option value="Tocantins">Tocantins</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">Observações (Opcional)</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Alguma informação adicional sobre sua consulta..."
              className="mobile-input w-full h-20 resize-none"
            />
          </div>

          {/* Summary */}
          {selectedDate && selectedTime && (
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">Resumo da Consulta</h3>
              <div className="space-y-1 text-sm text-blue-700">
                <p>📅 {new Date(selectedDate).toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })} às {selectedTime}</p>
                <p>{consultationType === 'presencial' ? '🏠' : '💻'} {consultationType === 'presencial' ? 'Atendimento Domiciliar' : 'Consulta Online'}</p>
                <p>💰 R$ {physiotherapist.price}</p>
              </div>
            </div>
          )}

          {/* Book Button */}
          <button
            onClick={handleBooking}
            disabled={!selectedDate || !selectedTime || isLoading}
            className="mobile-btn w-full bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Agendando...' : 'Confirmar Agendamento'}
          </button>

          {/* Bottom spacing */}
          <div className="h-8"></div>
        </div>
      </div>
    </div>
  );
};
