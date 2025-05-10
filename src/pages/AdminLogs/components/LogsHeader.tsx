import React from 'react';
import { Activity } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext.tsx';

const LogsHeader: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t('logs.history.title')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('logs.history.description')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogsHeader;
