import { ArrowLeft, Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showNotifications?: boolean;
  showMenu?: boolean;
  onBack?: () => void;
  onNotifications?: () => void;
  onMenu?: () => void;
}

export const Header = ({
  title,
  showBackButton = false,
  showNotifications = true,
  showMenu = false,
  onBack,
  onNotifications,
  onMenu
}: HeaderProps) => {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side */}
        <div className="flex items-center">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="mr-2 -ml-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          {showMenu && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenu}
              className="mr-2 -ml-2"
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Title */}
        <h1 className="font-semibold text-lg text-foreground text-center flex-1">
          {title}
        </h1>

        {/* Right side */}
        <div className="flex items-center">
          {showNotifications && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onNotifications}
              className="relative -mr-2"
            >
              <Bell className="w-5 h-5" />
              {/* Notification badge */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full"></div>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};