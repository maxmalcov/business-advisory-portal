
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Search, FileUp, FileDown, Download, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface InvoiceUpload {
  id: string;
  file_name: string;
  invoice_type: 'sale' | 'supplier';
  created_at: string;
  sent_to_email: string | null;
  sent_at: string | null;
  file_path: string;
  storage_path: string;
}

interface InvoiceHistoryListProps {
  defaultType?: 'all' | 'sale' | 'supplier';
}

const InvoiceHistoryList: React.FC<InvoiceHistoryListProps> = ({ 
  defaultType = 'all' 
}) => {
  const [invoices, setInvoices] = useState<InvoiceUpload[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<InvoiceUpload[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'sale' | 'supplier'>(defaultType);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    
    async function fetchInvoiceHistory() {
      setIsLoading(true);
      try {
        let query = supabase
          .from('invoice_uploads')
          .select('*')
          .order('created_at', { ascending: false });
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching invoice history:', error);
          toast({
            variant: 'destructive',
            title: 'Error loading invoices',
            description: 'Failed to load your invoice history.',
          });
          return;
        }
        
        setInvoices(data || []);
        setFilteredInvoices(data || []);
      } catch (error) {
        console.error('Error in invoice history fetch:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchInvoiceHistory();
  }, [user, toast]);

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

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Tabs value={filterType} onValueChange={(v) => setFilterType(v as any)} className="sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="sale">Sales</TabsTrigger>
            <TabsTrigger value="supplier">Supplier</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {isLoading ? (
        <div className="text-center py-10">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading invoice history...</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <div className="bg-muted py-2 px-4 grid grid-cols-7 text-sm font-medium">
            <div className="col-span-2">File Name</div>
            <div>Type</div>
            <div>Upload Date</div>
            <div>Sent To</div>
            <div>Sent At</div>
            <div className="text-right">Actions</div>
          </div>
          <div className="divide-y">
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <div 
                  key={invoice.id} 
                  className="grid grid-cols-7 py-3 px-4 items-center text-sm"
                >
                  <div className="col-span-2 flex items-center">
                    {invoice.invoice_type === 'sale' ? (
                      <FileUp className="h-4 w-4 mr-2 text-muted-foreground" />
                    ) : (
                      <FileDown className="h-4 w-4 mr-2 text-muted-foreground" />
                    )}
                    <span className="truncate" title={invoice.file_name}>{invoice.file_name}</span>
                  </div>
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      invoice.invoice_type === 'sale' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' 
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100'
                    }`}>
                      {invoice.invoice_type === 'sale' ? 'Sales' : 'Supplier'}
                    </span>
                  </div>
                  <div title={invoice.created_at}>
                    {format(new Date(invoice.created_at), 'MMM d, yyyy')}
                  </div>
                  <div className="truncate" title={invoice.sent_to_email || 'Not sent'}>
                    {invoice.sent_to_email || 'Not sent'}
                  </div>
                  <div>
                    {invoice.sent_at 
                      ? format(new Date(invoice.sent_at), 'MMM d, yyyy') 
                      : 'Not sent'}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      title="View Invoice"
                      onClick={() => handleViewInvoice(invoice)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      title="Download Invoice"
                      onClick={() => handleDownloadInvoice(invoice)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-muted-foreground">
                {searchQuery 
                  ? 'No invoices found matching your search.'
                  : filterType !== 'all'
                    ? `No ${filterType} invoices found.`
                    : 'No invoice history available.'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceHistoryList;
