
import React from 'react';
import { IframeSubscription } from '../../../hooks/types';

interface SubscriptionDetailsProps {
  subscription: IframeSubscription;
  formatDate: (date?: Date) => string;
}

const SubscriptionDetails: React.FC<SubscriptionDetailsProps> = ({
  subscription,
  formatDate,
}) => {
  return (
    <div className="p-4 grid grid-cols-2 gap-4">
      <div>
        <div className="text-sm text-muted-foreground mb-1">Status</div>
        <div className="font-medium flex items-center">
          {subscription.status === 'active' ? (
            <>
              <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              Active
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
              Inactive
            </>
          )}
        </div>
      </div>
      
      <div>
        <div className="text-sm text-muted-foreground mb-1">URL</div>
        <div className="font-medium text-sm truncate">
          {subscription.url || 'No URL configured'}
        </div>
      </div>
      
      <div>
        <div className="text-sm text-muted-foreground mb-1">Start Date</div>
        <div className="font-medium">
          {formatDate(subscription.startDate)}
        </div>
      </div>
      
      <div>
        <div className="text-sm text-muted-foreground mb-1">End Date</div>
        <div className="font-medium">
          {subscription.isLifetime 
            ? "Lifetime (No expiration)" 
            : formatDate(subscription.endDate)}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetails;
