import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AdminStats {
  totalClients: number;
  newThisMonth: number;
  pendingRequests: number;
  serviceTasks: {
    total: number;
    pending: number;
    completed: number;
    rejected: number;
  };
  loading: boolean;
}

export const useAdminStats = (): AdminStats => {
  const { toast } = useToast();
  const [stats, setStats] = useState<AdminStats>({
    totalClients: 0,
    newThisMonth: 0,
    pendingRequests: 0,
    serviceTasks: {
      total: 0,
      pending: 0,
      completed: 0,
      rejected: 0
    },
    loading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get current date information for monthly calculations
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        // Fetch total clients (users with usertype = 'client')
        const { data: clients, error: clientsError } = await supabase
          .from('profiles')
          .select('id, created_at')
          .eq('usertype', 'client');
        
        if (clientsError) throw clientsError;
        
        // Calculate new clients this month
        const newClients = clients?.filter(client => {
          const createdAt = new Date(client.created_at);
          return createdAt >= firstDayOfMonth;
        }) || [];
        
        // Fetch pending service requests
        const { data: pendingRequests, error: pendingError } = await supabase
          .from('service_requests')
          .select('id')
          .eq('status', 'pending');
          
        if (pendingError) throw pendingError;
        
        // Fetch service requests with their statuses
        const { data: allRequests, error: requestsError } = await supabase
          .from('service_requests')
          .select('status');
          
        if (requestsError) throw requestsError;
        
        // Calculate service tasks by status
        const serviceTasks = {
          total: allRequests?.length || 0,
          pending: allRequests?.filter(req => req.status === 'pending').length || 0,
          completed: allRequests?.filter(req => req.status === 'completed').length || 0,
          rejected: allRequests?.filter(req => req.status === 'rejected').length || 0
        };
        
        // Update the stats
        setStats(prev => ({
          ...prev,
          serviceTasks,
          loading: false
        }));
        
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        toast({
          title: "Error loading stats",
          description: "There was a problem loading the dashboard statistics",
          variant: "destructive"
        });
        setStats(prev => ({ ...prev, loading: false }));
      }
    };
    
    fetchStats();
  }, [toast]);

  return stats;
};
