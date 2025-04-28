
import React from 'react';
import { Language, useLanguage } from '@/context/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  
  const handleLanguageChange = (value: Language) => {
    setLanguage(value);
  };

  // Get flag icon based on selected language
  const getFlagIcon = () => {
    switch (language) {
      case 'en':
        return <span className="flex items-center justify-center w-6 h-4 bg-blue-600 relative overflow-hidden rounded">
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-xs font-bold">EN</span>
          </span>
        </span>;
      case 'es':
        return <span className="flex flex-col w-6 h-4 rounded overflow-hidden">
          <span className="flex-1 bg-red-600"></span>
          <span className="flex-1 bg-yellow-400"></span>
          <span className="flex-1 bg-red-600"></span>
        </span>;
      default:
        return <Flag className="h-4 w-4" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="p-1 h-8 w-8">
          {getFlagIcon()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLanguageChange('en')} className="cursor-pointer">
          <span className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-4 bg-blue-600 relative overflow-hidden rounded">
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-xs font-bold">EN</span>
              </span>
            </span>
            <span>English</span>
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange('es')} className="cursor-pointer">
          <span className="flex items-center gap-2">
            <span className="flex flex-col w-6 h-4 rounded overflow-hidden">
              <span className="flex-1 bg-red-600"></span>
              <span className="flex-1 bg-yellow-400"></span>
              <span className="flex-1 bg-red-600"></span>
            </span>
            <span>Español</span>
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
