
import React from 'react';
import { useLanguage } from '@/context/language';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  
  const handleLanguageChange = (value: string) => {
    setLanguage(value as 'en' | 'es' | 'ru');
  };

  return (
    <Select value={language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder={t('app.language')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="es">Español</SelectItem>
        <SelectItem value="ru">Русский</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
