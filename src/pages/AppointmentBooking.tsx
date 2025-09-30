import { useState } from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, CreditCard, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Header } from '@/components/Layout/Header';
import { mockPhysiotherapists } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AppointmentBookingProps {
  physiotherapistId?: string;
  onBack: () => void;
  onSuccess: () => void;
}

export const AppointmentBooking = ({ 
  physiotherapistId = 'physio_001', 
  onBack, 
  onSuccess 
}: AppointmentBookingProps) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [isLoading, setIsLoading] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const physiotherapist = mockPhysiotherapists.find(p => p.id === physiotherapistId);

  if (!physiotherapist) {
    return <div>Fisioterapeuta não encontrado</div>;
  }

  // Generate available dates (next 7 days)
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date;
  });

  // Available time slots
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00',
    '14:00', '15:00', '16:00', '17:00'
  ];

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate booking process
    setTimeout(() => {
      toast({
        title: "Agendamento realizado com sucesso!",
        description: `Sua sessão com ${physiotherapist.name} foi confirmada.`,
      });
      setIsLoading(false);
      onSuccess();
    }, 2000);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short'
    }).format(date);
  };

  const getTotalPrice = () => {
    return physiotherapist.pricePerSession;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="Agendar Consulta"
        showBackButton
        onBack={onBack}
      />
      
      <form onSubmit={handleBooking} className="px-4 py-6 space-y-6">
        {/* Physiotherapist Summary */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-3">
              <img
                src={physiotherapist.profileImage}
                alt={physiotherapist.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-semibold">{physiotherapist.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {physiotherapist.specialties[0]}
                </p>
                <p className="text-sm font-medium text-primary">
                  R$ {physiotherapist.pricePerSession}/sessão
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Selecionar Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {availableDates.map((date, index) => (
                <Button
                  key={index}
                  type="button"
                  variant={selectedDate === date.toISOString().split('T')[0] ? 'default' : 'outline'}
                  onClick={() => setSelectedDate(date.toISOString().split('T')[0])}
                  className="h-auto p-3 flex flex-col"
                >
                  <span className="text-sm font-medium">{formatDate(date)}</span>
                  <span className="text-xs opacity-70">
                    {date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Selecionar Horário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  type="button"
                  variant={selectedTime === time ? 'default' : 'outline'}
                  onClick={() => setSelectedTime(time)}
                  className="text-sm"
                >
                  {time}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Address Confirmation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Local do Atendimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="font-medium text-sm">{user?.address}</p>
              <Button variant="ghost" size="sm" className="text-primary p-0 h-auto mt-1">
                Alterar endereço
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Observações (Opcional)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Descreva brevemente seu problema ou suas necessidades específicas..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-20"
            />
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Forma de Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="credit"
                  name="payment"
                  value="credit"
                  checked={paymentMethod === 'credit'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4"
                />
                <Label htmlFor="credit" className="text-sm font-medium">
                  Cartão de Crédito/Débito
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="pix"
                  name="payment"
                  value="pix"
                  checked={paymentMethod === 'pix'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4"
                />
                <Label htmlFor="pix" className="text-sm font-medium">
                  PIX
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="cash"
                  name="payment"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4"
                />
                <Label htmlFor="cash" className="text-sm font-medium">
                  Dinheiro (no local)
                </Label>
              </div>
            </div>

            {paymentMethod === 'credit' && (
              <div className="space-y-3 pt-3 border-t">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="cardNumber" className="text-xs">Número do Cartão</Label>
                    <Input
                      id="cardNumber"
                      placeholder="**** **** **** ****"
                      className="h-10 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv" className="text-xs">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="***"
                      className="h-10 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Total */}
        <Card className="bg-gradient-card">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Valor da sessão:</span>
              <span className="font-medium">R$ {getTotalPrice()}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Taxa de serviço:</span>
              <span className="font-medium">R$ 0,00</span>
            </div>
            <div className="border-t pt-2 flex justify-between items-center">
              <span className="font-semibold">Total:</span>
              <span className="text-xl font-bold text-primary">
                R$ {getTotalPrice()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Book Button */}
        <Button
          type="submit"
          disabled={!selectedDate || !selectedTime || isLoading}
          className="w-full h-12 bg-gradient-primary text-base font-medium"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Confirmando...
            </div>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Confirmar Agendamento
            </>
          )}
        </Button>
      </form>
    </div>
  );
};