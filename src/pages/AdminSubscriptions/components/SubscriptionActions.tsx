import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { Subscription } from '../types';

type SubscriptionActionsProps = {
  subscription: Subscription;
  onStatusChange: (
    subscriptionId: string,
    newStatus: 'active' | 'pending' | 'rejected' | 'inactive',
  ) => void;
  onEdit: (subscription: Subscription) => void;
};

const SubscriptionActions: React.FC<SubscriptionActionsProps> = ({
  subscription,
  onStatusChange,
  onEdit,
}) => {
  return (
    <div className="flex justify-end space-x-2">
      {subscription.status !== 'active' && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onStatusChange(subscription.id, 'active')}
        >
          <Check className="h-4 w-4 mr-1" />
          Approve
        </Button>
      )}
      {subscription.status !== 'rejected' &&
        subscription.status !== 'inactive' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStatusChange(subscription.id, 'rejected')}
          >
            <X className="h-4 w-4 mr-1" />
            Reject
          </Button>
        )}
      <Button variant="outline" size="sm" onClick={() => onEdit(subscription)}>
        Edit
      </Button>
    </div>
  );
};

export default SubscriptionActions;
