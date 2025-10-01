import { useState } from 'react';
import { Calendar, Clock, MapPin, Phone, Video, Plus, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MobileLayout } from '@/components/Layout/MobileLayout';

interface Consultation {
  id: string;
  physiotherapistName: string;
  physiotherapistImage: string;
  date: string;
  time: string;
  type: 'presencial' | 'online';
  status: 'agendada' | 'concluida' | 'cancelada';
  specialty: string;
  address?: string;
  notes?: string;
}

const mockConsultations: Consultation[] = [
  {
    id: '1',
    physiotherapistName: 'Dr. Carlos Silva',
    physiotherapistImage: '/placeholder.svg',
    date: '2024-10-02',
    time: '14:00',
    type: 'presencial',
    status: 'agendada',
    specialty: 'Ortopedia',
    address: 'Rua das Flores, 123 - Vila Madalena',
    notes: 'Sessão de fisioterapia para dor nas costas'
  },
  {
    id: '2',
    physiotherapistName: 'Dra. Ana Costa',
    physiotherapistImage: '/placeholder.svg',
    date: '2024-09-30',
    time: '10:00',
    type: 'online',
    status: 'concluida',
    specialty: 'Neurologia',
    notes: 'Avaliação neurológica completa'
  },
  {
    id: '3',
    physiotherapistName: 'Dr. Pedro Oliveira',
    physiotherapistImage: '/placeholder.svg',
    date: '2024-10-05',
    time: '16:30',
    type: 'presencial',
    status: 'agendada',
    specialty: 'Esportiva',
    address: 'Av. Paulista, 1000 - Bela Vista'
  }
];

export const ConsultationsScreen = () => {
  const [activeTab, setActiveTab] = useState('todas');

  const canCancelOrReschedule = (consultation: Consultation) => {
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
    return hoursUntilConsultation >= 24;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendada':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'concluida':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelada':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'agendada':
        return 'Agendada';
      case 'concluida':
        return 'Concluída';
      case 'cancelada':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const filterConsultations = (status: string) => {
    if (status === 'todas') return mockConsultations;
    return mockConsultations.filter(consultation => consultation.status === status);
  };

  const ConsultationCard = ({ consultation }: { consultation: Consultation }) => (
    <Card className="p-4 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={consultation.physiotherapistImage} />
            <AvatarFallback>
              {consultation.physiotherapistName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">
              {consultation.physiotherapistName}
            </h3>
            <p className="text-sm text-muted-foreground">
              {consultation.specialty}
            </p>
          </div>
        </div>
        <Badge className={getStatusColor(consultation.status)}>
          {getStatusText(consultation.status)}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{new Date(consultation.date).toLocaleDateString('pt-BR')}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{consultation.time}</span>
        </div>

        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          {consultation.type === 'presencial' ? (
            <MapPin className="w-4 h-4" />
          ) : (
            <Video className="w-4 h-4" />
          )}
          <span>
            {consultation.type === 'presencial' 
              ? consultation.address || 'Atendimento domiciliar'
              : 'Consulta online'
            }
          </span>
        </div>

        {consultation.notes && (
          <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
            {consultation.notes}
          </p>
        )}
      </div>

      <div className="flex space-x-2 pt-2">
        {consultation.status === 'agendada' && (
          <>
            {canCancelOrReschedule(consultation) && (
              <Button variant="outline" size="sm" className="flex-1">
                Reagendar
              </Button>
            )}
            {canCancelOrReschedule(consultation) && (
              <Button variant="outline" size="sm" className="flex-1">
                Cancelar
              </Button>
            )}
            {consultation.type === 'online' && (
              <Button size="sm" className="flex-1">
                <Video className="w-4 h-4 mr-1" />
                Entrar
              </Button>
            )}
          </>
        )}
        
        {consultation.status === 'concluida' && (
          <Button variant="outline" size="sm" className="flex-1">
            Ver Detalhes
          </Button>
        )}
        
        <Button variant="outline" size="sm">
          <Phone className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );

  return (
    <MobileLayout showNavigation currentPage="appointments">
      <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Minhas Consultas</h1>
          <Button size="sm" className="bg-gradient-primary">
            <Plus className="w-4 h-4 mr-1" />
            Agendar
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <div className="sticky top-16 bg-background border-b border-border">
            <TabsList className="w-full justify-start rounded-none bg-transparent p-0 h-auto">
              <TabsTrigger 
                value="todas" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Todas
              </TabsTrigger>
              <TabsTrigger 
                value="agendada"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Agendadas
              </TabsTrigger>
              <TabsTrigger 
                value="concluida"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Concluídas
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-4">
            <TabsContent value="todas" className="mt-0 space-y-4">
              {filterConsultations('todas').map(consultation => (
                <ConsultationCard key={consultation.id} consultation={consultation} />
              ))}
            </TabsContent>

            <TabsContent value="agendada" className="mt-0 space-y-4">
              {filterConsultations('agendada').map(consultation => (
                <ConsultationCard key={consultation.id} consultation={consultation} />
              ))}
            </TabsContent>

            <TabsContent value="concluida" className="mt-0 space-y-4">
              {filterConsultations('concluida').map(consultation => (
                <ConsultationCard key={consultation.id} consultation={consultation} />
              ))}
            </TabsContent>
          </div>
        </Tabs>
      </div>
      </div>
    </MobileLayout>
  );
};
