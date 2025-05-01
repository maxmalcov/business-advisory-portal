
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { InvoiceUpload } from '../components/InvoiceHistoryList';
import {sendEmail} from "@/integrations/email";

export function useInvoiceFileOperations() {
  const { toast } = useToast();

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
      console.log(url)
      a.href = url;
      a.download = invoice.file_name || 'download';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };

  return {
    handleViewInvoice,
    handleDownloadInvoice
  };
}
