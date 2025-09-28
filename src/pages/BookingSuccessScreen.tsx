import { useState, useEffect } from 'react';

interface BookingSuccessScreenProps {
  onGoHome: () => void;
  onViewConsultations: () => void;
}

export const BookingSuccessScreen = ({ onGoHome, onViewConsultations }: BookingSuccessScreenProps) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onViewConsultations(); // Vai automaticamente para consultas após 5 segundos
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onViewConsultations]);

  return (
    <div className="mobile-container">
      <div className="mobile-safe-area min-h-screen bg-white flex flex-col items-center justify-center px-6">
        {/* Success Animation */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <div className="text-4xl">✅</div>
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Consulta Agendada!
        </h1>
        
        <p className="text-gray-600 text-center mb-8 leading-relaxed">
          Sua consulta foi agendada com sucesso. Você receberá uma confirmação em breve.
        </p>

        {/* Countdown */}
        <div className="bg-blue-50 rounded-lg p-4 mb-8 text-center">
          <p className="text-sm text-blue-700">
            Redirecionando para suas consultas em {countdown} segundos...
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-3">
          <button
            onClick={onViewConsultations}
            className="mobile-btn w-full bg-blue-600 text-white"
          >
            📅 Ver Minhas Consultas
          </button>
          
          <button
            onClick={onGoHome}
            className="mobile-btn w-full bg-gray-100 text-gray-700"
          >
            🏠 Voltar ao Início
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg w-full">
          <h3 className="text-sm font-medium text-gray-800 mb-2">📋 Próximos passos:</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Aguarde a confirmação do fisioterapeuta</li>
            <li>• Você será notificado por WhatsApp</li>
            <li>• Prepare o local para o atendimento</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
