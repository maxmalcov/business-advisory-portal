
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { IframeSubscription } from '../../../hooks/types';

interface SubscriptionOverviewProps {
  subscriptions: IframeSubscription[];
}

const SubscriptionOverview: React.FC<SubscriptionOverviewProps> = ({ subscriptions }) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {subscriptions.map((subscription) => (
        <div 
          key={subscription.id} 
          className="flex items-center justify-between p-2 rounded-lg border-none bg-transparent"
        >
          <div className="space-y-1">
            <h3 className="font-medium text-sm">{subscription.name}</h3>
            {subscription.endDate && !subscription.isLifetime && (
              <p className="text-xs text-muted-foreground">
                Valid until: {new Date(subscription.endDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            )}
          </div>
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
