import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Badge } from 'lucide-react';

const SubscriptionsHeader: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center space-x-4 pb-4 border-b">
      <div className="bg-primary/10 p-3 rounded-full">
        <Badge className="h-6 w-6 text-primary" />
      </div>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t('nav.subscriptions')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t('subscriptions.requests.description')}
        </p>
      </div>
    </div>
  );
};

export default SubscriptionsHeader;
