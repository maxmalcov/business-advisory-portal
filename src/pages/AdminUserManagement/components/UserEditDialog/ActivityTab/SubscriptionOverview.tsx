
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { IframeSubscription } from '../../../hooks/types';

interface SubscriptionOverviewProps {
  subscriptions: IframeSubscription[];
}

const SubscriptionOverview: React.FC<SubscriptionOverviewProps> = ({ subscriptions }) => {
  return (
    <div className="space-y-2">
      {subscriptions.map((subscription) => (
        <div 
          key={subscription.id} 
          className="flex items-center justify-between py-2"
        >
          <h3 className="font-medium text-sm">{subscription.name}</h3>
          <Badge 
            variant="outline" 
            className={
              subscription.status === 'active'
                ? 'bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-700'
            }
          >
            {subscription.status === 'active' ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      ))}
    </div>
  );
};

export default SubscriptionOverview;
