
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AdminStats {
  totalClients: number;
  newThisMonth: number;
  pendingRequests: number;
  serviceTasks: number;
  loading: boolean;
}

export const useAdminStats = (): AdminStats => {
  const { toast } = useToast();
  const [stats, setStats] = useState<AdminStats>({
    totalClients: 0,
    newThisMonth: 0,
    pendingRequests: 0,
    serviceTasks: 0,
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
        
        // Fetch all service tasks (all service requests)
        const { data: allRequests, error: requestsError } = await supabase
          .from('service_requests')
          .select('id');
          
        if (requestsError) throw requestsError;
        
        // Update the stats
        setStats({
          totalClients: clients?.length || 0,
          newThisMonth: newClients.length,
          pendingRequests: pendingRequests?.length || 0,
          serviceTasks: allRequests?.length || 0,
          loading: false
        });
        
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
