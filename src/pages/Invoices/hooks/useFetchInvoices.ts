import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { InvoiceUpload } from '../components/InvoiceHistoryList';

export function useFetchInvoices() {
  const [invoices, setInvoices] = useState<InvoiceUpload[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchInvoiceHistory();
  }, []);

  async function fetchInvoiceHistory() {
    setIsLoading(true);
    try {
      // Use a raw query to fetch from the invoice_uploads table
      const { data, error } = await supabase
        .from('invoice_files')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching invoice history:', error);
        toast({
          variant: 'destructive',
          title: 'Error loading invoices',
          description: 'Failed to load your invoice history.',
        });
        return;
      }

      // Cast the data to the correct type
      const typedData = data as unknown as InvoiceUpload[];
      setInvoices(typedData || []);
    } catch (error) {
      console.error('Error in invoice history fetch:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    invoices,
    isLoading,
    refreshInvoices: fetchInvoiceHistory,
  };
}
