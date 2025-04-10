
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { InvoiceStats, MonthlyData } from './types';

export const useInvoiceStats = () => {
  const { toast } = useToast();
  const [invoiceStats, setInvoiceStats] = useState<InvoiceStats>({
    total: 0,
    sales: 0,
    supplier: 0,
    thisMonth: 0,
    lastMonth: 0,
  });
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => ({
      name: month, 
      sales: 0, 
      supplier: 0
    }));
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchInvoiceStats = async () => {
      try {
        const { data: invoices, error: invoiceError } = await supabase
          .from('invoice_uploads')
          .select('*');
        
        if (invoiceError) throw invoiceError;
        
        if (invoices) {
          console.log('Invoices data from Supabase:', invoices);
          
          const currentDate = new Date();
          const thisMonth = currentDate.getMonth();
          const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
          const currentYear = currentDate.getFullYear();
          
          const salesInvoices = invoices.filter(inv => inv.invoice_type === 'sale');
          const supplierInvoices = invoices.filter(inv => inv.invoice_type === 'supplier');
          
          const thisMonthInvoices = invoices.filter(inv => {
            const invDate = new Date(inv.created_at);
            return invDate.getMonth() === thisMonth && invDate.getFullYear() === currentYear;
          });
          
          const lastMonthInvoices = invoices.filter(inv => {
            const invDate = new Date(inv.created_at);
            return invDate.getMonth() === lastMonth && 
              (lastMonth === 11 ? invDate.getFullYear() === currentYear - 1 : invDate.getFullYear() === currentYear);
          });
          
          setInvoiceStats({
            total: invoices.length,
            sales: salesInvoices.length,
            supplier: supplierInvoices.length,
            thisMonth: thisMonthInvoices.length,
            lastMonth: lastMonthInvoices.length,
          });
          
          // Reset monthly data before populating
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const initialMonthlyData = months.map(month => ({
            name: month, 
            sales: 0, 
            supplier: 0
          }));
          
          // Group by month and count
          if (invoices.length > 0) {
            console.log('Processing invoices for monthly chart:', invoices.length);
            
            for (const invoice of invoices) {
              if (!invoice.created_at) {
                console.log('Invoice missing created_at date:', invoice);
                continue;
              }
              
              const invDate = new Date(invoice.created_at);
              const monthIndex = invDate.getMonth();
              
              // Make sure the month index is valid before using it
              if (monthIndex >= 0 && monthIndex < 12) {
                if (invoice.invoice_type === 'sale') {
                  initialMonthlyData[monthIndex].sales += 1;
                } else if (invoice.invoice_type === 'supplier') {
                  initialMonthlyData[monthIndex].supplier += 1;
                }
              }
            }
            
            console.log('Updated monthly data:', initialMonthlyData);
            setMonthlyData(initialMonthlyData);
          } else {
            console.log('No invoices found to process for monthly chart, using mock data');
            // Add some mock data for demonstration
            setMonthlyData([
              { name: 'Jan', sales: 4, supplier: 2 },
              { name: 'Feb', sales: 3, supplier: 1 },
              { name: 'Mar', sales: 5, supplier: 3 },
              { name: 'Apr', sales: 2, supplier: 4 },
              { name: 'May', sales: 6, supplier: 2 },
              { name: 'Jun', sales: 3, supplier: 1 },
              { name: 'Jul', sales: 5, supplier: 2 },
              { name: 'Aug', sales: 4, supplier: 3 },
              { name: 'Sep', sales: 7, supplier: 1 },
              { name: 'Oct', sales: 2, supplier: 4 },
              { name: 'Nov', sales: 4, supplier: 3 },
              { name: 'Dec', sales: 3, supplier: 2 }
            ]);
          }
        } else {
          console.log('No invoices data returned from Supabase, using mock data');
          // Ensure we have default mock data if no invoices are returned
          setMonthlyData([
            { name: 'Jan', sales: 4, supplier: 2 },
            { name: 'Feb', sales: 3, supplier: 1 },
            { name: 'Mar', sales: 5, supplier: 3 },
            { name: 'Apr', sales: 2, supplier: 4 },
            { name: 'May', sales: 6, supplier: 2 },
            { name: 'Jun', sales: 3, supplier: 1 },
            { name: 'Jul', sales: 5, supplier: 2 },
            { name: 'Aug', sales: 4, supplier: 3 },
            { name: 'Sep', sales: 7, supplier: 1 },
            { name: 'Oct', sales: 2, supplier: 4 },
            { name: 'Nov', sales: 4, supplier: 3 },
            { name: 'Dec', sales: 3, supplier: 2 }
          ]);
        }
      } catch (err) {
        console.error('Error fetching invoice stats:', err);
        setError(err instanceof Error ? err : new Error('Unknown error fetching invoice stats'));
        
        // Use mock data as fallback
        setInvoiceStats({
          total: 42,
          sales: 28,
          supplier: 14,
          thisMonth: 8,
          lastMonth: 6,
        });
        
        setMonthlyData([
          { name: 'Jan', sales: 4, supplier: 2 },
          { name: 'Feb', sales: 3, supplier: 1 },
          { name: 'Mar', sales: 5, supplier: 3 },
          { name: 'Apr', sales: 2, supplier: 4 },
          { name: 'May', sales: 6, supplier: 2 },
          { name: 'Jun', sales: 3, supplier: 1 },
          { name: 'Jul', sales: 5, supplier: 2 },
          { name: 'Aug', sales: 4, supplier: 3 },
          { name: 'Sep', sales: 7, supplier: 1 },
          { name: 'Oct', sales: 2, supplier: 4 },
          { name: 'Nov', sales: 4, supplier: 3 },
          { name: 'Dec', sales: 3, supplier: 2 }
        ]);
        
        toast({
          variant: "destructive",
          title: "Error loading invoice data",
          description: "There was a problem loading your invoice data. Using mock data instead.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchInvoiceStats();
  }, [toast]);

  return {
    invoiceStats,
    monthlyData,
    loading,
    error
  };
};
