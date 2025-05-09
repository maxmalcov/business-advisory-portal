import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext.tsx';

interface ServiceSearchProps {
  value: string;
  onChange: (value: string) => void;
}

const ServiceSearch: React.FC<ServiceSearchProps> = ({ value, onChange }) => {
  const { t } = useLanguage();

  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={t('services.search.placeholder')}
        className="pl-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default ServiceSearch;
