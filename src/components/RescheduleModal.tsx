import { useState } from 'react';

interface RescheduleModalProps {
  isOpen: boolean;
  consultation: {
    id: string;
    physiotherapistName: string;
    date: string;
    time: string;
  };
  onClose: () => void;
  onConfirm: (consultationId: string, newDate: string, newTime: string) => void;
}

export const RescheduleModal = ({ isOpen, consultation, onClose, onConfirm }: RescheduleModalProps) => {
  const [newDate, setNewDate] = useState(consultation.date);
  const [newTime, setNewTime] = useState(consultation.time);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!newDate || !newTime) {
      alert('Por favor, selecione data e horário');
      return;
    }
    onConfirm(consultation.id, newDate, newTime);
    onClose();
  };

  const getNextDays = (count: number) => {
    const days = [];
    for (let i = 0; i <= count; i++) {
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

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-t-2xl p-6 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">🔄 Reagendar Consulta</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            ✕
          </button>
        </div>

        {/* Consultation Info */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-1">{consultation.physiotherapistName}</h3>
          <p className="text-sm text-gray-600">
            📅 {new Date(consultation.date).toLocaleDateString('pt-BR')} às {consultation.time}
          </p>
        </div>

        {/* New Date Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            📅 Nova Data
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
            {getNextDays(14).map((day) => (
              <button
                key={day.value}
                onClick={() => setNewDate(day.value)}
                className={`p-3 text-sm rounded-lg border transition-colors ${
                  newDate === day.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        {/* New Time Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            🕐 Novo Horário
          </label>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => setNewTime(time)}
                className={`p-3 text-sm rounded-lg border transition-colors ${
                  newTime === time
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Confirmar Reagendamento
          </button>
        </div>
      </div>
    </div>
  );
};

