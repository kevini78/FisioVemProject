import { useState } from 'react';
import { Search, Filter, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MobileLayout } from '@/components/Layout/MobileLayout';
import { Header } from '@/components/Layout/Header';
import { PhysiotherapistCard } from '@/components/UI/PhysiotherapistCard';
import { useAuth } from '@/context/AuthContext';
import { mockPhysiotherapists, specialties } from '@/data/mockData';

interface HomeScreenProps {
  onNavigate: (page: string) => void;
  onPhysiotherapistSelect: (id: string) => void;
}

export const HomeScreen = ({ onNavigate, onPhysiotherapistSelect }: HomeScreenProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const { user } = useAuth();

  const filteredPhysiotherapists = mockPhysiotherapists.filter(physio => {
    const matchesSearch = physio.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         physio.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSpecialty = !selectedSpecialty || physio.specialties.includes(selectedSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  return (
    <MobileLayout showNavigation currentPage="home">
      <Header
        title="FisioVem"
        showNotifications
        onNotifications={() => onNavigate('notifications')}
      />
      
      <div className="px-4 py-6 space-y-6">
        {/* Greeting */}
        <div className="bg-gradient-card rounded-xl p-4">
          <h2 className="text-lg font-semibold text-foreground">
            Olá, {user?.name?.split(' ')[0]}! 👋
          </h2>
          <p className="text-muted-foreground mt-1">
            Como podemos ajudá-lo hoje?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-gradient-primary text-primary-foreground">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">🏠</div>
              <h3 className="font-medium mb-1">Atendimento</h3>
              <p className="text-xs opacity-90">Domiciliar</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-accent text-accent-foreground">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">📅</div>
              <h3 className="font-medium mb-1">Agendamento</h3>
              <p className="text-xs opacity-90">Rápido</p>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar fisioterapeutas ou especialidades..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {/* Location */}
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mr-1" />
          <span>São Paulo, SP - Rua das Flores, 123</span>
          <Button variant="ghost" size="sm" className="ml-auto text-primary">
            Alterar
          </Button>
        </div>

        {/* Specialty Filters */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Especialidades</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedSpecialty('')}
            >
              Ver todas
            </Button>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {specialties.slice(0, 6).map((specialty) => (
              <Button
                key={specialty}
                variant={selectedSpecialty === specialty ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedSpecialty(specialty === selectedSpecialty ? '' : specialty)}
                className="whitespace-nowrap"
              >
                {specialty}
              </Button>
            ))}
          </div>
        </div>

        {/* Physiotherapists List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">
              Fisioterapeutas disponíveis ({filteredPhysiotherapists.length})
            </h3>
            <Button variant="ghost" size="sm">
              <Filter className="w-4 h-4 mr-1" />
              Filtros
            </Button>
          </div>

          {filteredPhysiotherapists.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-2">🔍</div>
                <h4 className="font-medium mb-1">Nenhum resultado encontrado</h4>
                <p className="text-sm text-muted-foreground">
                  Tente buscar por outra especialidade ou fisioterapeuta
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredPhysiotherapists.map((physio) => (
                <PhysiotherapistCard
                  key={physio.id}
                  physiotherapist={physio}
                  onSelect={onPhysiotherapistSelect}
                  distance={Math.random() * 5 + 1} // Mock distance
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};