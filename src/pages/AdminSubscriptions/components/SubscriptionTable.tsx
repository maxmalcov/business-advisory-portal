
import React from 'react';
import { Subscription } from '../types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import StatusBadge from './StatusBadge';
import SubscriptionTypeIcon from './SubscriptionTypeIcon';
import SubscriptionActions from './SubscriptionActions';

type SubscriptionTableProps = {
  subscriptions: Subscription[];
  onStatusChange: (subscriptionId: string, newStatus: 'active' | 'pending' | 'rejected' | 'inactive') => void;
  onEdit: (subscription: Subscription) => void;
};

const SubscriptionTable: React.FC<SubscriptionTableProps> = ({ 
  subscriptions, 
  onStatusChange,
  onEdit 
}) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>URL</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((subscription) => (
            <TableRow key={subscription.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2">
                  <SubscriptionTypeIcon type={subscription.type} />
                  <span>{subscription.name}</span>
                </div>
              </TableCell>
              <TableCell>{subscription.type}</TableCell>
              <TableCell>{subscription.userName}</TableCell>
              <TableCell>
                <StatusBadge status={subscription.status} />
              </TableCell>
              <TableCell className="max-w-xs truncate">{subscription.url}</TableCell>
              <TableCell className="text-right">
                <SubscriptionActions 
                  subscription={subscription}
                  onStatusChange={onStatusChange}
                  onEdit={onEdit}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SubscriptionTable;
