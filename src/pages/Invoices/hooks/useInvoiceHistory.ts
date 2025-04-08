
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { InvoiceUpload } from '../components/InvoiceHistoryList';

type FilterType = 'all' | 'sale' | 'supplier';

export function useInvoiceHistory(defaultType: FilterType = 'all') {
  const [invoices, setInvoices] = useState<InvoiceUpload[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<InvoiceUpload[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<FilterType>(defaultType);
  const { toast } = useToast();

  useEffect(() => {
    fetchInvoiceHistory();
  }, []);

  useEffect(() => {
    // Filter invoices based on search query and type filter
    let filtered = [...invoices];
    
    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(invoice => invoice.invoice_type === filterType);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(invoice => 
        invoice.file_name.toLowerCase().includes(query) ||
        (invoice.sent_to_email && invoice.sent_to_email.toLowerCase().includes(query))
      );
    }
    
    setFilteredInvoices(filtered);
  }, [invoices, searchQuery, filterType]);

  async function fetchInvoiceHistory() {
    setIsLoading(true);
    try {
      // Use a raw query to fetch from the invoice_uploads table since TypeScript doesn't recognize it yet
      const { data, error } = await supabase
        .from('invoice_uploads')
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
      setFilteredInvoices(typedData || []);
    } catch (error) {
      console.error('Error in invoice history fetch:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleViewInvoice = async (invoice: InvoiceUpload) => {
    try {
      const { data, error } = await supabase.storage
        .from('invoices')
        .createSignedUrl(invoice.storage_path, 60);
        
      if (error) {
        console.error('Error creating signed URL:', error);
        toast({
          variant: 'destructive',
          title: 'Access Error',
          description: 'Could not access the file.',
        });
        return;
      }
      
      // Open the URL in a new tab
      window.open(data.signedUrl, '_blank');
    } catch (error) {
      console.error('Error viewing invoice:', error);
    }
  };

  const handleDownloadInvoice = async (invoice: InvoiceUpload) => {
    try {
      const { data, error } = await supabase.storage
        .from('invoices')
        .download(invoice.storage_path);
      
      if (error) {
        console.error('Error downloading file:', error);
        toast({
          variant: 'destructive',
          title: 'Download Error',
          description: 'Could not download the file.',
        });
        return;
      }
      
      // Create a download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = invoice.file_name;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };

  return {
    invoices: filteredInvoices,
    isLoading,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    handleViewInvoice,
    handleDownloadInvoice
  };
}
