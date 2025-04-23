
import React from 'react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { SubscriptionData } from '../../hooks/types/subscriptionTypes';

interface SubscriptionTableProps {
  subscriptions: SubscriptionData[];
  loading: boolean;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">Active</Badge>;
    case 'expired':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200">Expired</Badge>;
    case 'cancelled':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const SubscriptionTable: React.FC<SubscriptionTableProps> = ({ subscriptions, loading }) => {
  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client Name</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Activation Date</TableHead>
              <TableHead>Expiration Date</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell><div className="h-4 bg-muted rounded w-32 animate-pulse"></div></TableCell>
                <TableCell><div className="h-4 bg-muted rounded w-24 animate-pulse"></div></TableCell>
                <TableCell><div className="h-6 bg-muted rounded w-20 animate-pulse"></div></TableCell>
                <TableCell><div className="h-4 bg-muted rounded w-24 animate-pulse"></div></TableCell>
                <TableCell><div className="h-4 bg-muted rounded w-24 animate-pulse"></div></TableCell>
                <TableCell><div className="h-4 bg-muted rounded w-16 animate-pulse"></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="py-10 text-center border rounded-md">
        <p className="text-muted-foreground">No subscriptions found matching your filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client Name</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Activation Date</TableHead>
            <TableHead>Expiration Date</TableHead>
            <TableHead>Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((subscription) => (
            <TableRow key={subscription.id}>
              <TableCell>{subscription.clientName}</TableCell>
              <TableCell>{subscription.planName}</TableCell>
              <TableCell>
                <StatusBadge status={subscription.status} />
              </TableCell>
              <TableCell>{format(new Date(subscription.activationDate), 'MMM d, yyyy')}</TableCell>
              <TableCell>{format(new Date(subscription.expirationDate), 'MMM d, yyyy')}</TableCell>
              <TableCell className="capitalize">{subscription.type}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SubscriptionTable;
