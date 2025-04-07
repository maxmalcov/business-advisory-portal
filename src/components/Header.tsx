
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import { Button } from '@/components/ui/button';
import { LogOut, User, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Header: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { t } = useLanguage();
  
  // Function to get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    
    const nameParts = user.name.split(' ');
    if (nameParts.length === 1) return nameParts[0][0].toUpperCase();
    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="font-bold text-2xl text-ba-blue">
            Business Advisory
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <LanguageSelector />
          
          {isLoading ? (
            <div className="flex items-center">
              <Loader2 className="h-5 w-5 animate-spin text-gray-600 mr-2" />
              <span className="text-sm text-gray-600">Loading...</span>
            </div>
          ) : isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <Link to="/profile" className="text-sm text-gray-600 hover:text-gray-900 flex items-center">
                <Avatar className="h-8 w-8 mr-2 bg-primary text-white">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{user?.name || 'User'}</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout} className="text-gray-600 hover:text-gray-900">
                <LogOut size={18} className="mr-1" />
                {t('app.logout')}
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login">
                <Button variant="ghost">{t('app.login')}</Button>
              </Link>
              <Link to="/register">
                <Button variant="register">{t('app.register')}</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
