
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ServiceStats } from '../../hooks/types/serviceTypes';
import { Sparkles, CheckCircle, Clock, XCircle, BarChart } from 'lucide-react';

interface ServiceStatsCardsProps {
  stats: ServiceStats;
  loading: boolean;
}

const ServiceStatsCards: React.FC<ServiceStatsCardsProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="p-4">
              <div className="h-4 bg-muted rounded w-24 animate-pulse" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="h-8 bg-muted rounded w-16 animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <Card>
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
          <Sparkles className="h-4 w-4 text-[#9b87f5]" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-2xl font-bold">{stats.totalRequests}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-2xl font-bold">{stats.completed}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          <Clock className="h-4 w-4 text-[#7E69AB]" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-2xl font-bold">{stats.inProgress}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">Cancelled</CardTitle>
          <XCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-2xl font-bold">{stats.cancelled}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">Most Requested</CardTitle>
          <BarChart className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-lg font-bold truncate" title={stats.mostRequestedService || 'None'}>
            {stats.mostRequestedService || 'None'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceStatsCards;
