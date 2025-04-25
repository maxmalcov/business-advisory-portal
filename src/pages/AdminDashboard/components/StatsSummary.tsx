
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAdminStats } from '../hooks/useAdminStats';

const StatsSummary: React.FC = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const { totalClients, newThisMonth, pendingRequests, totalInvoices, loading } = useAdminStats();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{t('admin.statistics')}</h2>
      <div className={`grid grid-cols-1 ${isMobile ? 'gap-3' : 'sm:grid-cols-2 md:grid-cols-4 gap-4'}`}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground text-center">
              Total Clients
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-center">{totalClients}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground text-center">
              New This Month
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-center">{newThisMonth}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground text-center">
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-center">{pendingRequests}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground text-center">
              Total Invoices
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-center">{totalInvoices}</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatsSummary;
