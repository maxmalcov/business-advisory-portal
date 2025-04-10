
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
  
  // Generate mock monthly data
  const generateMockMonthlyData = (): MonthlyData[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => ({
      name: month,
      sales: Math.floor(Math.random() * 10) + 1, // Random values between 1-10
      supplier: Math.floor(Math.random() * 8) + 1, // Random values between 1-8
    }));
  };
  
  // Initialize with mock data to ensure we always have something to display
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>(generateMockMonthlyData());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchInvoiceStats = async () => {
      try {
        const { data: invoices, error: invoiceError } = await supabase
          .from('invoice_uploads')
          .select('*');
        
        if (invoiceError) throw invoiceError;
        
        if (invoices && invoices.length > 0) {
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
          
          console.log('Updated monthly data from real data:', initialMonthlyData);
          // Check if we have any non-zero values
          const hasRealData = initialMonthlyData.some(item => item.sales > 0 || item.supplier > 0);
          
          if (hasRealData) {
            setMonthlyData(initialMonthlyData);
          } else {
            console.log('No real data available, using mock data');
            // If there's no actual data, use mock data
            setMonthlyData(generateMockMonthlyData());
          }
        } else {
          console.log('No invoices found or empty array, using mock data');
          // Add mock data for demonstration
          setMonthlyData(generateMockMonthlyData());
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
        
        // Generate mock data for the chart
        setMonthlyData(generateMockMonthlyData());
        
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
