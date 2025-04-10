
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import { Button } from '@/components/ui/button';
import { LogOut, User, Loader2 } from 'lucide-react';
import { ThemeToggleButton } from '@/components/ThemeToggle';

const Header: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { t } = useLanguage();

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Logo removed from here */}
        </div>

        <div className="flex items-center space-x-4">
          <LanguageSelector />
          
          {isLoading ? (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Loader2 size={18} className="animate-spin" />
              <span>Loading...</span>
            </div>
          ) : isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <Link to="/profile" className="text-sm text-gray-600 hover:text-gray-900 flex items-center">
                <User size={18} className="mr-1" />
                {user?.name || user?.email || 'User'}
              </Link>
              <Button variant="ghost" size="sm" onClick={logout} className="text-gray-600 hover:text-gray-900">
                <LogOut size={18} className="mr-1" />
                {t('app.logout')}
              </Button>
              <ThemeToggleButton />
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
      </div>
    </header>
  );
};

export default Header;
