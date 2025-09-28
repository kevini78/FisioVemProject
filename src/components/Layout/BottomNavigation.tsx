import { Home, Calendar, User, Search, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavigationProps {
  currentPage: string;
  onPageChange?: (page: string) => void;
}

const navigationItems = [
  { id: 'home', icon: Home, label: 'Início' },
  { id: 'search', icon: Search, label: 'Buscar' },
  { id: 'appointments', icon: Calendar, label: 'Consultas' },
  { id: 'reviews', icon: Star, label: 'Avaliações' },
  { id: 'profile', icon: User, label: 'Perfil' }
];

export const BottomNavigation = ({ currentPage, onPageChange }: BottomNavigationProps) => {
  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-card border-t border-border">
      <div className="flex items-center justify-around py-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange?.(item.id)}
              className={cn(
                "flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-fast",
                "min-w-[60px] text-xs font-medium",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon className={cn("w-5 h-5 mb-1", isActive && "scale-110")} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};