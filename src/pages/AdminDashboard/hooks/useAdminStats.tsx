
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AdminStats {
  totalClients: number;
  newThisMonth: number;
  pendingRequests: number;
  totalInvoices: number;
  loading: boolean;
}

export const useAdminStats = (): AdminStats => {
  const { toast } = useToast();
  const [stats, setStats] = useState<AdminStats>({
    totalClients: 0,
    newThisMonth: 0,
    pendingRequests: 0,
    totalInvoices: 0,
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
        
        // Fetch all invoices from both tables
        // 1. Get invoice files (sale invoices)
        const { data: invoiceFiles, error: invoiceFilesError } = await supabase
          .from('invoice_files')
          .select('id');
          
        if (invoiceFilesError) throw invoiceFilesError;
        
        // 2. Get supplier invoice files
        const { data: invoiceUploads, error: invoiceUploadsError } = await supabase
          .from('invoice_uploads')
          .select('id');
          
        if (invoiceUploadsError) throw invoiceUploadsError;

        // Calculate total invoices as sum of both tables
        const totalInvoices = 
          (invoiceFiles?.length || 0) + 
          (invoiceUploads?.length || 0);
        
        console.log('Admin stats - invoices found:', {
          invoiceFiles: invoiceFiles?.length || 0,
          invoiceUploads: invoiceUploads?.length || 0,
          total: totalInvoices
        });
        
        // Update the stats
        setStats({
          totalClients: clients?.length || 0,
          newThisMonth: newClients.length,
          pendingRequests: pendingRequests?.length || 0,
          totalInvoices: totalInvoices,
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
