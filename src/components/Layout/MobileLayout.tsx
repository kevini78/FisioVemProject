import { ReactNode } from 'react';
import { BottomNavigation } from './BottomNavigation';

interface MobileLayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
  currentPage?: string;
}

export const MobileLayout = ({ 
  children, 
  showNavigation = true, 
  currentPage = 'home' 
}: MobileLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      {/* Main Content */}
      <main className={`flex-1 ${showNavigation ? 'pb-20' : ''}`}>
        {children}
      </main>
      
      {/* Bottom Navigation */}
      {showNavigation && (
        <BottomNavigation currentPage={currentPage} />
      )}
    </div>
  );
};