
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

type SubscriptionHeaderProps = {
  onAddNew: () => void;
  onAddNewType: () => void;
};

const SubscriptionHeader: React.FC<SubscriptionHeaderProps> = ({ onAddNew, onAddNewType }) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold tracking-tight">{t('admin.subscriptions.title')}</h1>
      <div className="flex space-x-2">
        <Button variant="outline" onClick={onAddNewType}>
          <Plus className="h-4 w-4 mr-1" />
          Add New Subscription Type
        </Button>
        <Button onClick={onAddNew}>
          <Plus className="h-4 w-4 mr-1" />
          Assign a New Subscription
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionHeader;
