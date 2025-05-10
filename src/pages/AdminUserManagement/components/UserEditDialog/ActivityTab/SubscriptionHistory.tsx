import React, {useEffect, useState} from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { SubscriptionHistoryEntry } from '../../../hooks/types';
import {supabase} from "@/integrations/supabase/client.ts";
import {CheckCircle, Clock, XCircle} from "lucide-react";

interface SubscriptionHistoryProps {
  userId: string;
  selectedSubscriptionId?: string;
}

const SubscriptionHistory: React.FC<SubscriptionHistoryProps> = ({
  userId,
  selectedSubscriptionId,
}) => {
  const [filteredHistory, setFilteredHistory] = useState([])

  useEffect(() => {
    (async () => {
      const {data, error} = await supabase.from('user_tool_subscriptions').select("*").eq('user_id', userId)

      setFilteredHistory(data)
    })()
  },[])

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
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  const formatPeriodChanges = (entry: SubscriptionHistoryEntry) => {
    if (entry.action !== 'period_updated' || !entry.periodChanges) {
      return null;
    }

    const pc = entry.periodChanges;
    const formatDate = (date?: Date) =>
      date ? format(date, 'MMM dd, yyyy') : 'N/A';

    const isLifetimeChanged = pc.oldIsLifetime !== pc.newIsLifetime;

    if (isLifetimeChanged) {
      return pc.newIsLifetime
        ? 'Changed to lifetime subscription (no expiration)'
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

    return 'Subscription period updated';
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredHistory.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell><h4 className="font-medium">{entry.tool_name}</h4></TableCell>
            <TableCell>
              <Badge
                  variant="outline"
                  className={
                    entry.status === 'active'
                        ? 'bg-green-50 text-green-600 hover:bg-green-100'
                        : entry.status === 'pending'
                            ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                  }
              >
                {entry.status === 'active' && (
                    <CheckCircle className="h-3 w-3 mr-1" />
                )}
                {entry.status === 'pending' && (
                    <Clock className="h-3 w-3 mr-1" />
                )}
                {entry.status === 'rejected' && (
                    <XCircle className="h-3 w-3 mr-1" />
                )}
                {entry.status === 'inactive' && (
                    <XCircle className="h-3 w-3 mr-1" />
                )}
                {entry.status === 'active'
                    ? 'Active'
                    : entry.status === 'pending'
                        ? 'Pending'
                        : entry.status === 'rejected' ?
                'Rejected' : 'Inactive'}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SubscriptionHistory;
