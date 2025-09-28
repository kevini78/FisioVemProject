import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Appointment, Physiotherapist } from '@/types';

interface AppointmentCardProps {
  appointment: Appointment;
  physiotherapist?: Physiotherapist;
  onViewDetails?: (id: string) => void;
  onCancel?: (id: string) => void;
  onReview?: (id: string) => void;
}

const statusColors = {
  scheduled: 'bg-primary/10 text-primary',
  'in-progress': 'bg-accent/10 text-accent',
  completed: 'bg-success/10 text-success',
  cancelled: 'bg-destructive/10 text-destructive'
};

const statusLabels = {
  scheduled: 'Agendado',
  'in-progress': 'Em andamento',
  completed: 'Concluído',
  cancelled: 'Cancelado'
};

export const AppointmentCard = ({
  appointment,
  physiotherapist,
  onViewDetails,
  onCancel,
  onReview
}: AppointmentCardProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short'
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card className="bg-gradient-card border-border shadow-sm">
      <CardContent className="p-4">
        {/* Header with status */}
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2 py-1 rounded-md text-xs font-medium ${statusColors[appointment.status]}`}>
            {statusLabels[appointment.status]}
          </span>
          <span className="text-sm text-muted-foreground">
            #{appointment.id.slice(-4).toUpperCase()}
          </span>
        </div>

        {/* Physiotherapist info */}
        {physiotherapist && (
          <div className="flex items-center gap-3 mb-3">
            <img
              src={physiotherapist.profileImage}
              alt={physiotherapist.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-medium text-foreground">
                {physiotherapist.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {physiotherapist.specialties[0]}
              </p>
            </div>
          </div>
        )}

        {/* Appointment details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{formatDate(appointment.date)}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-2" />
            <span>{formatTime(appointment.date)} - {appointment.duration}min</span>
          </div>
          <div className="flex items-start text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2 mt-0.5" />
            <span className="flex-1">{appointment.address}</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold text-primary">
            R$ {appointment.price.toFixed(2)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {appointment.status === 'scheduled' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCancel?.(appointment.id)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={() => onViewDetails?.(appointment.id)}
                className="flex-1 bg-gradient-primary"
              >
                Ver detalhes
              </Button>
            </>
          )}
          
          {appointment.status === 'completed' && (
            <Button
              size="sm"
              onClick={() => onReview?.(appointment.id)}
              className="w-full bg-gradient-accent"
            >
              Avaliar atendimento
            </Button>
          )}
          
          {appointment.status === 'in-progress' && (
            <Button
              size="sm"
              onClick={() => onViewDetails?.(appointment.id)}
              className="w-full bg-gradient-primary"
            >
              Acompanhar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};