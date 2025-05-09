
import { useState, useEffect, useMemo } from 'react';
import { format, parseISO, subMonths } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  SubscriptionStats, 
  SubscriptionData, 
  SubscriptionChartData,
  SubscriptionFilters 
} from './types/subscriptionTypes';

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
        
        const { data: subscriptionsData, error: subscriptionsError } = await supabase
          .from('user_tool_subscriptions')
          .select(`
            *
          `);

        if (subscriptionsError) throw subscriptionsError;

        const formattedData: SubscriptionData[] = subscriptionsData.map((sub: any) => ({
          id: sub.id,
          clientName: sub.profiles?.name || 'Unknown',
          planName: sub.tool_name || 'Unknown Plan',
          status: sub.status as SubscriptionData['status'],
          activationDate: sub.activated_at || sub.requested_at,
          expirationDate: sub.expires_at || '',
          type: 'monthly' // Default to monthly, update as needed
        }));

        setSubscriptions(formattedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching subscriptions:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch subscriptions'));
        toast({
          variant: "destructive",
          title: "Error loading subscription data",
          description: "There was a problem loading the subscription data.",
        });
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [toast]);

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter(sub => {
      // Filter by status
      if (filters.status !== 'all' && sub.status !== filters.status) return false;
      
      // Filter by search
      if (filters.search && 
          !sub.clientName.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
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
        sub.expirationDate ? format(new Date(sub.expirationDate), 'yyyy-MM-dd') : 'N/A',
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
