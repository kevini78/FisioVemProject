import { Star, MapPin, Clock, Badge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Physiotherapist } from '@/types';

interface PhysiotherapistCardProps {
  physiotherapist: Physiotherapist;
  onSelect: (id: string) => void;
  distance?: number;
}

export const PhysiotherapistCard = ({ 
  physiotherapist, 
  onSelect, 
  distance = 2.5 
}: PhysiotherapistCardProps) => {
  return (
    <Card className="bg-gradient-card border-border shadow-md hover:shadow-lg transition-all duration-normal">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Profile Image */}
          <div className="relative">
            <img
              src={physiotherapist.profileImage}
              alt={physiotherapist.name}
              className="w-16 h-16 rounded-xl object-cover"
            />
            {physiotherapist.isVerified && (
              <div className="absolute -top-1 -right-1 bg-success rounded-full p-1">
                <Badge className="w-3 h-3 text-success-foreground" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-foreground truncate">
                {physiotherapist.name}
              </h3>
              <div className="flex items-center text-sm text-muted-foreground ml-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span>{physiotherapist.rating}</span>
                <span className="ml-1">({physiotherapist.totalReviews})</span>
              </div>
            </div>

            {/* Specialties */}
            <div className="flex flex-wrap gap-1 mb-2">
              {physiotherapist.specialties.slice(0, 2).map((specialty) => (
                <span
                  key={specialty}
                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                >
                  {specialty}
                </span>
              ))}
              {physiotherapist.specialties.length > 2 && (
                <span className="text-xs text-muted-foreground px-1">
                  +{physiotherapist.specialties.length - 2}
                </span>
              )}
            </div>

            {/* Info row */}
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{distance} km</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{physiotherapist.experience} anos</span>
              </div>
            </div>

            {/* Price and Button */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-primary">
                  R$ {physiotherapist.pricePerSession.toFixed(0)}
                </span>
                <span className="text-sm text-muted-foreground ml-1">
                  /sessão
                </span>
              </div>
              <Button
                size="sm"
                onClick={() => onSelect(physiotherapist.id)}
                className="bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                Agendar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};