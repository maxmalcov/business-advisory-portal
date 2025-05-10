import React from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IframeSubscription } from '../../../hooks/types';

interface SubscriptionHeaderProps {
  subscription: IframeSubscription;
  onToggleStatus: (id: string) => void;
  onEditClick: () => void;
}

const SubscriptionHeader: React.FC<SubscriptionHeaderProps> = ({
  subscription,
  onToggleStatus,
  onEditClick,
}) => {
  return (
    <div className="p-4 bg-muted/30 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <span className="font-medium">{subscription.name}</span>
        <Badge
          variant="outline"
          className={
            subscription.status === 'active'
              ? 'bg-green-50 text-green-600 hover:bg-green-100'
              : 'bg-red-50 text-red-600 hover:bg-red-100'
          }
        >
          {subscription.status === 'active' ? 'Active' : 'Inactive'}
        </Badge>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onToggleStatus(subscription.id)}
          className={
            subscription.status === 'active'
              ? 'border-red-200 text-red-600 hover:bg-red-50'
              : 'border-green-200 text-green-600 hover:bg-green-50'
          }
        >
          {subscription.status === 'active' ? (
            <>
              <X className="h-4 w-4 mr-1" />
              Deactivate
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-1" />
              Activate
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onEditClick}
          disabled={subscription.status !== 'active'}
        >
          <span className="h-4 w-4 mr-1" />
          Edit Period
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionHeader;
