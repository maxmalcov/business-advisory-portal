
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import { Button } from '@/components/ui/button';
import { LogOut, User, Loader2, Menu, X } from 'lucide-react';
import { ThemeToggleButton } from '@/components/ThemeToggle';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetClose 
} from '@/components/ui/sheet';

const Header: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
  };

  // Content for the authenticated user menu
  const authUserContent = (
    <>
      <Link 
        to="/profile" 
        className="text-sm text-foreground hover:text-foreground/90 flex items-center"
        onClick={() => setMenuOpen(false)}
      >
        <User size={18} className="mr-1" />
        {user?.name || user?.email || 'User'}
      </Link>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleLogout}
        className="text-foreground hover:text-foreground/90"
      >
        <LogOut size={18} className="mr-1" />
        {t('app.logout')}
      </Button>
      
      <ThemeToggleButton />
    </>
  );

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {isAuthenticated ? (
            <Link to="/dashboard" className="font-bold text-xl md:text-2xl text-ba-blue">
              Business Advisory
            </Link>
          ) : (
            <span className="font-bold text-xl md:text-2xl text-ba-blue">
              Business Advisory
            </span>
          )}
        </div>

        {isMobile && isAuthenticated ? (
          <div className="flex items-center">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] pt-12">
                <div className="flex flex-col space-y-4 items-start">
                  <LanguageSelector />
                  {authUserContent}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            
            {isLoading ? (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Loader2 size={18} className="animate-spin" />
                <span>Loading...</span>
              </div>
            ) : isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {authUserContent}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="ghost">{t('app.login')}</Button>
                </Link>
                <Link to="/register">
                  <Button variant="register">{t('app.register')}</Button>
                </Link>
                <ThemeToggleButton />
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
