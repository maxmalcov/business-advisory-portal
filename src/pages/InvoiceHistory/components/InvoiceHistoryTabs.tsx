
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUp, FileDown, Archive, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const InvoiceHistoryTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [invoiceData, setInvoiceData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching invoice data for user:', user?.id);
        
        // Fetch data from both invoice_uploads and invoice_files tables
        const { data: uploadsData, error: uploadsError } = await supabase
          .from('invoice_uploads')
          .select('*')
          .eq('user_id', user?.id);
          
        if (uploadsError) {
          console.error('Error fetching invoice uploads:', uploadsError);
          throw uploadsError;
        }
        
        console.log('Uploads data:', uploadsData?.length || 0, 'records found');
        
        // Fetch from invoice_files as well
        const { data: filesData, error: filesError } = await supabase
          .from('invoice_files')
          .select('*')
          .eq('user_id', user?.id);
          
        if (filesError) {
          console.error('Error fetching invoice files:', filesError);
          throw filesError;
        }
        
        console.log('Files data:', filesData?.length || 0, 'records found');
        
        // Combine and format the data
        const combinedData = [
          ...(uploadsData || []).map(item => ({ 
            ...item, 
            source: 'uploads',
            type: item.invoice_type
          })),
          ...(filesData || []).map(item => ({ 
            ...item, 
            source: 'files',
            type: item.invoice_type
          }))
        ];
        
        // Sort by created_at date, most recent first
        combinedData.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        
        console.log('Combined data:', combinedData.length, 'total records');
        
        setInvoiceData(combinedData);
      } catch (err: any) {
        console.error('Error in fetchInvoiceData:', err);
        setError(err.message || 'An error occurred while fetching invoice data');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchInvoiceData();
    } else {
      setIsLoading(false);
      setError('User not authenticated');
    }
  }, [user]);

  const filteredData = activeTab === 'all' 
    ? invoiceData 
    : invoiceData.filter(invoice => invoice.type === activeTab);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4 p-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      );
    }

    if (invoiceData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Archive className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No invoice history found</h3>
          <p className="text-muted-foreground mt-2 mb-6">
            You haven't uploaded any invoices yet. Start by uploading your first invoice.
          </p>
          <div className="flex gap-4">
            <Button asChild>
              <Link to="/invoices?tab=upload">Upload Sales Invoice</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/supplier-invoices?tab=upload">Upload Supplier Invoice</Link>
            </Button>
          </div>
        </div>
      );
    }

    if (filteredData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Archive className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No invoices found for this type</h3>
          <p className="text-muted-foreground mt-2">
            Try selecting a different tab or upload an invoice of this type.
          </p>
        </div>
      );
    }

    // Render the invoice data
    return (
      <div className="space-y-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">File Name</th>
              <th className="text-left p-2">Type</th>
              <th className="text-left p-2">Uploaded</th>
              <th className="text-left p-2">Size</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((invoice, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{invoice.file_name}</td>
                <td className="p-2 capitalize">{invoice.type}</td>
                <td className="p-2">{new Date(invoice.created_at).toLocaleString()}</td>
                <td className="p-2">{Math.round(invoice.file_size / 1024)} KB</td>
                <td className="p-2">
                  <Button variant="ghost" size="sm" disabled>
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="all" className="flex items-center gap-1">
          <Archive className="h-4 w-4" />
          <span>All Invoices</span>
        </TabsTrigger>
        <TabsTrigger value="sales" className="flex items-center gap-1">
          <FileUp className="h-4 w-4" />
          <span>Sales</span>
        </TabsTrigger>
        <TabsTrigger value="supplier" className="flex items-center gap-1">
          <FileDown className="h-4 w-4" />
          <span>Supplier</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value={activeTab} className="mt-2">
        {renderContent()}
      </TabsContent>
    </Tabs>
  );
};

export default InvoiceHistoryTabs;
