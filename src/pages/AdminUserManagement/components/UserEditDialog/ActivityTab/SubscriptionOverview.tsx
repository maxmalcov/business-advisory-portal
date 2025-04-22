
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { IframeSubscription } from '../../../hooks/types';

interface SubscriptionOverviewProps {
  subscriptions: IframeSubscription[];
}

const SubscriptionOverview: React.FC<SubscriptionOverviewProps> = ({ subscriptions }) => {
  const activeSubscriptions = subscriptions.filter(
    (subscription) => subscription.status === 'active'
  );

  return (
    <div className="space-y-2">
      {activeSubscriptions.map((subscription) => (
        <div 
          key={subscription.id} 
          className="flex items-center justify-between py-2"
        >
          <h3 className="font-medium text-sm">{subscription.name}</h3>
          <Badge 
            variant="outline" 
            className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
          >
            Active
          </Badge>
        </div>
      ))}
    </div>
  );
};

export default SubscriptionOverview;
