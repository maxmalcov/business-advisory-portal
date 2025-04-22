
import React from 'react';
import { format } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { SubscriptionHistoryEntry } from '../../../hooks/types';

interface SubscriptionHistoryProps {
  history: SubscriptionHistoryEntry[];
  selectedSubscriptionId?: string;
}

const SubscriptionHistory: React.FC<SubscriptionHistoryProps> = ({
  history,
  selectedSubscriptionId
}) => {
  const filteredHistory = selectedSubscriptionId 
    ? history.filter(entry => entry.subscriptionId === selectedSubscriptionId)
    : history;
  
  if (filteredHistory.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No subscription history available.
      </div>
    );
  }
  
  const getActionBadge = (action: string) => {
    switch (action) {
      case 'activated':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600">
            Activated
          </Badge>
        );
      case 'deactivated':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600">
            Deactivated
          </Badge>
        );
      case 'period_updated':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600">
            Period Updated
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {action}
          </Badge>
        );
    }
  };
  
  const formatPeriodChanges = (entry: SubscriptionHistoryEntry) => {
    if (entry.action !== 'period_updated' || !entry.periodChanges) {
      return null;
    }
    
    const pc = entry.periodChanges;
    const formatDate = (date?: Date) => date ? format(date, 'MMM dd, yyyy') : 'N/A';
    
    const isLifetimeChanged = pc.oldIsLifetime !== pc.newIsLifetime;
    
    if (isLifetimeChanged) {
      return pc.newIsLifetime 
        ? "Changed to lifetime subscription (no expiration)" 
        : `Changed from lifetime to expire on ${formatDate(pc.newEndDate)}`;
    }
    
    // Start date changed
    if (pc.oldStartDate?.getTime() !== pc.newStartDate?.getTime()) {
      return `Start date changed from ${formatDate(pc.oldStartDate)} to ${formatDate(pc.newStartDate)}`;
    }
    
    // End date changed
    if (pc.oldEndDate?.getTime() !== pc.newEndDate?.getTime()) {
      return `End date changed from ${formatDate(pc.oldEndDate)} to ${formatDate(pc.newEndDate)}`;
    }
    
    return "Subscription period updated";
  };
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Action</TableHead>
          <TableHead>Details</TableHead>
          <TableHead>Admin</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredHistory.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell className="font-medium">
              {format(entry.date, 'MMM dd, yyyy')}
            </TableCell>
            <TableCell>
              {getActionBadge(entry.action)}
            </TableCell>
            <TableCell>
              {entry.action === 'period_updated' ? formatPeriodChanges(entry) : ''}
            </TableCell>
            <TableCell>
              {entry.adminName || 'System'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SubscriptionHistory;
