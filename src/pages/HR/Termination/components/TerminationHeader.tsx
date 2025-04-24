
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { UserMinus } from 'lucide-react';

const TerminationHeader: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center space-x-4 pb-4 border-b">
      <div className="bg-primary/10 p-3 rounded-full">
        <UserMinus className="h-6 w-6 text-primary" />
      </div>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('hr.termination.title')}</h1>
        <p className="text-muted-foreground mt-1">
          Process employee exits and manage terminations
        </p>
      </div>
    </div>
  );
};

export default TerminationHeader;
