
import { useState, useEffect, useMemo } from 'react';
import { format, parseISO, startOfMonth, subMonths } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SubscriptionFilters, SubscriptionStats, SubscriptionData, SubscriptionChartData } from './types/subscriptionTypes';

const defaultFilters: SubscriptionFilters = {
  dateRange: {
    from: subMonths(new Date(), 1),
    to: new Date()
  },
  dateFilterOption: 'last30days',
  status: 'all',
  planType: 'all',
  search: ''
};

export const useSubscriptionStatsReports = () => {
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<SubscriptionFilters>(defaultFilters);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true);
        
        // We need to use supabase.from('user_subscriptions').select() but since it's not in types.ts yet,
        // we'll use a type assertion to tell TypeScript it's okay
        const { data: subscriptionsData, error: subscriptionsError } = await supabase
          .from('user_subscriptions' as any)
          .select(`
            *,
            profiles:user_id(name),
            subscription_plans:plan_id(name, type)
          `);

        if (subscriptionsError) throw subscriptionsError;

        // Now we need to map the data safely
        const formattedData: SubscriptionData[] = subscriptionsData.map((sub: any) => ({
          id: sub.id,
          clientName: sub.profiles?.name || 'Unknown',
          planName: sub.subscription_plans?.name || 'Unknown Plan',
          status: sub.status,
          activationDate: sub.activation_date,
          expirationDate: sub.expiration_date,
          type: sub.subscription_plans?.type || 'monthly'
        }));

        setSubscriptions(formattedData);
      } catch (err) {
        console.error('Error fetching subscriptions:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch subscriptions'));
        toast({
          variant: "destructive",
          title: "Error loading subscription data",
          description: "There was a problem loading the subscription data.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [toast]);

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter(sub => {
      if (filters.status !== 'all' && sub.status !== filters.status) return false;
      if (filters.planType !== 'all' && sub.type !== filters.planType) return false;
      if (filters.search && !sub.clientName.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [subscriptions, filters]);

  const subscriptionStats = useMemo<SubscriptionStats>(() => ({
    totalSubscriptions: filteredSubscriptions.length,
    activeSubscriptions: filteredSubscriptions.filter(s => s.status === 'active').length,
    expiredSubscriptions: filteredSubscriptions.filter(s => s.status === 'expired').length,
    cancelledSubscriptions: filteredSubscriptions.filter(s => s.status === 'cancelled').length
  }), [filteredSubscriptions]);

  const chartData = useMemo<SubscriptionChartData[]>(() => {
    const months = new Map<string, number>();
    
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthKey = format(date, 'MMM yyyy');
      months.set(monthKey, 0);
    }
    
    filteredSubscriptions.forEach(sub => {
      const activationDate = parseISO(sub.activationDate);
      const monthKey = format(activationDate, 'MMM yyyy');
      
      if (months.has(monthKey)) {
        months.set(monthKey, months.get(monthKey)! + 1);
      }
    });
    
    return Array.from(months).map(([month, count]) => ({
      month,
      count
    }));
  }, [filteredSubscriptions]);

  const exportToCSV = () => {
    if (filteredSubscriptions.length === 0) {
      toast({
        title: "No data to export",
        description: "There is no data matching your current filters to export.",
      });
      return;
    }
    
    try {
      const headers = ["Client Name", "Plan", "Status", "Activation Date", "Expiration Date", "Type"];
      const rows = filteredSubscriptions.map(sub => [
        sub.clientName,
        sub.planName,
        sub.status,
        format(new Date(sub.activationDate), 'yyyy-MM-dd'),
        format(new Date(sub.expirationDate), 'yyyy-MM-dd'),
        sub.type
      ]);
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.setAttribute('download', `subscription-data-${format(new Date(), 'yyyyMMdd')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export successful",
        description: "Subscription data has been exported to CSV.",
      });
    } catch (err) {
      console.error('Error exporting to CSV:', err);
      toast({
        variant: "destructive",
        title: "Export failed",
        description: "There was an error exporting the data to CSV.",
      });
    }
  };

  return {
    subscriptionStats,
    subscriptions: filteredSubscriptions,
    chartData,
    loading,
    error,
    filters,
    setFilters: (partialFilters: Partial<SubscriptionFilters>) => {
      setFilters(prev => ({ ...prev, ...partialFilters }));
    },
    exportToCSV
  };
};
