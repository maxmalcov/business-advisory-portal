
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';

type SubscriptionHeaderProps = {
  onAddNew: () => void;
};

const SubscriptionHeader: React.FC<SubscriptionHeaderProps> = ({ onAddNew }) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold tracking-tight">{t('admin.subscriptions.title')}</h1>
      <Button onClick={onAddNew}>Add New Subscription</Button>
    </div>
  );
};

export default SubscriptionHeader;
