
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { FileText, UsersRound, Package, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ActivityEvent } from '@/utils/activity';

interface StatsCardsProps {
  invoiceStats: {
    total: number;
    thisMonth: number;
  };
  employeeStats: {
    active: number;
    recentlyAdded: number;
  };
  servicesStats: {
    requested: number;
    completed: number;
    pending: number;
  };
  activityData: ActivityEvent[];
}

const StatsCards: React.FC<StatsCardsProps> = ({
  invoiceStats,
  employeeStats,
  servicesStats,
  activityData,
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{invoiceStats.total}</div>
          <p className="text-xs text-muted-foreground">
            {invoiceStats.thisMonth} uploaded this month
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <UsersRound className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{employeeStats.active}</div>
          <p className="text-xs text-muted-foreground">
            {employeeStats.recentlyAdded} added in last 30 days
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Service Requests</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{servicesStats.requested}</div>
          <p className="text-xs text-muted-foreground">
            {servicesStats.completed} completed, {servicesStats.pending} pending
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Activity</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activityData.length}</div>
          <p className="text-xs text-muted-foreground">
            Last activity: {activityData.length > 0 ? 
              formatDistanceToNow(activityData[0].timestamp, { addSuffix: true }) : 
              'No recent activity'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
