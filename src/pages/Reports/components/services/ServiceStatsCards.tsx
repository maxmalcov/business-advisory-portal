import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ServiceStats } from '../../hooks/types/serviceTypes';
import { Sparkles, CheckCircle, Clock, XCircle, BarChart } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ServiceStatsCardsProps {
  stats: ServiceStats;
  loading: boolean;
}

const ServiceStatsCards: React.FC<ServiceStatsCardsProps> = ({
  stats,
  loading,
}) => {
  const { language } = useLanguage();

  const getTexts = () => {
    return {
      totalRequests: 'Total Requests',
      completed: 'Completed',
      inProgress: 'Pending',
      cancelled: 'Rejected',
      mostRequested: 'Most Requested',
      none: 'None',
    };
  };

  const texts = getTexts();

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
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {texts.totalRequests}
          </CardTitle>
          <Sparkles className="h-4 w-4 text-[#9b87f5]" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-2xl font-bold">{stats.totalRequests}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {texts.completed}
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-2xl font-bold">{stats.completed}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {texts.inProgress}
          </CardTitle>
          <Clock className="h-4 w-4 text-[#7E69AB]" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-2xl font-bold">{stats.inProgress}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {texts.cancelled}
          </CardTitle>
          <XCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-2xl font-bold">{stats.cancelled}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {texts.mostRequested}
          </CardTitle>
          <BarChart className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p
            className="text-lg font-bold truncate"
            title={stats.mostRequestedService || texts.none}
          >
            {stats.mostRequestedService || texts.none}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceStatsCards;
