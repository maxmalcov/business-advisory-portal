import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { FileText, Users, Package, Clock } from 'lucide-react';
import { ActivityEvent } from '@/utils/activity';
import { useNavigate } from 'react-router-dom';

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
  onTabChange?: (tab: string) => void;
}

const StatsCards: React.FC<StatsCardsProps> = ({
  invoiceStats,
  employeeStats,
  servicesStats,
  activityData,
  onTabChange
}) => {
  const navigate = useNavigate();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card 
        className="cursor-pointer h-full transition-all duration-200 hover:bg-muted/50 hover:shadow-md"
        onClick={() => onTabChange?.('invoices')}
      >
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

      <Card className="h-full transition-all duration-200 hover:bg-muted/50 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{employeeStats.active}</div>
          <p className="text-xs text-muted-foreground">
            {employeeStats.recentlyAdded} added in last 30 days
          </p>
        </CardContent>
      </Card>
      
      <Card 
        className="cursor-pointer h-full transition-all duration-200 hover:bg-muted/50 hover:shadow-md"
        onClick={() => navigate('/admin/subscription-requests')}
      >
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
      
      <Card 
        className="cursor-pointer transition-colors hover:bg-muted/50"
        onClick={() => onTabChange?.('activity')}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground text-center">
            Total Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="text-2xl font-bold text-center">{activityData.length}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
