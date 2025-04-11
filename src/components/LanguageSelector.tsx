
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
        return <span className="flex flex-col w-6 h-4 rounded overflow-hidden relative">
          {/* USA Flag */}
          <span className="absolute inset-0 bg-blue-700"></span>
          <div className="absolute inset-0 flex flex-col">
            {/* Red stripes */}
            <div className="flex-1 flex flex-col">
              {[...Array(7)].map((_, i) => (
                <span key={i} className="flex-1 bg-red-600 even:bg-white"></span>
              ))}
            </div>
          </div>
          {/* Blue rectangle with stars */}
          <span className="absolute top-0 left-0 w-3 h-2 bg-blue-800 flex items-center justify-center">
            <span className="text-white text-[5px] font-bold">★★</span>
          </span>
        </span>;
      case 'es':
        return <span className="flex flex-col w-6 h-4 rounded overflow-hidden">
          <span className="flex-1 bg-red-600"></span>
          <span className="flex-1 bg-yellow-400"></span>
          <span className="flex-1 bg-red-600"></span>
        </span>;
      case 'ru':
        return <span className="flex flex-col w-6 h-4 rounded overflow-hidden">
          <span className="flex-1 bg-white"></span>
          <span className="flex-1 bg-blue-600"></span>
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
            {/* USA Flag for menu item */}
            <span className="flex flex-col w-6 h-4 rounded overflow-hidden relative">
              <span className="absolute inset-0 bg-blue-700"></span>
              <div className="absolute inset-0 flex flex-col">
                {/* Red stripes */}
                <div className="flex-1 flex flex-col">
                  {[...Array(7)].map((_, i) => (
                    <span key={i} className="flex-1 bg-red-600 even:bg-white"></span>
                  ))}
                </div>
              </div>
              {/* Blue rectangle with stars */}
              <span className="absolute top-0 left-0 w-3 h-2 bg-blue-800 flex items-center justify-center">
                <span className="text-white text-[5px] font-bold">★★</span>
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
        <DropdownMenuItem onClick={() => handleLanguageChange('ru')} className="cursor-pointer">
          <span className="flex items-center gap-2">
            <span className="flex flex-col w-6 h-4 rounded overflow-hidden">
              <span className="flex-1 bg-white"></span>
              <span className="flex-1 bg-blue-600"></span>
              <span className="flex-1 bg-red-600"></span>
            </span>
            <span>Русский</span>
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
