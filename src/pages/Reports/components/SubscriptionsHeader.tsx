
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Plus, PackageCheck } from 'lucide-react';

type SubscriptionHeaderProps = {
  onAddNew: () => void;
  onAddNewType: () => void;
};

const SubscriptionHeader: React.FC<SubscriptionHeaderProps> = ({ onAddNew, onAddNewType }) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <PackageCheck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Subscription Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage and oversee all platform subscriptions and subscription types
            </p>
          </div>
        </div>
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
    </div>
  );
};

export default SubscriptionHeader;
