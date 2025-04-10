
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ActivityEvent, getRecentActivity, getMockRecentActivity } from '@/utils/activity';

export interface ReportStats {
  invoiceStats: {
    total: number;
    sales: number;
    supplier: number;
    thisMonth: number;
    lastMonth: number;
  };
  employeeStats: {
    total: number;
    active: number;
    terminated: number;
    recentlyAdded: number;
  };
  servicesStats: {
    completed: number;
    pending: number;
    requested: number;
  };
  activityData: ActivityEvent[];
  monthlyData: {
    name: string;
    sales: number;
    supplier: number;
  }[];
  loading: boolean;
}

export const useReportData = (): ReportStats => {
  const { toast } = useToast();
  const [activityData, setActivityData] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [invoiceStats, setInvoiceStats] = useState({
    total: 0,
    sales: 0,
    supplier: 0,
    thisMonth: 0,
    lastMonth: 0,
  });
  const [employeeStats, setEmployeeStats] = useState({
    total: 0,
    active: 0,
    terminated: 0,
    recentlyAdded: 0,
  });
  const [servicesStats, setServicesStats] = useState({
    completed: 0,
    pending: 0,
    requested: 0,
  });
  
  // Initialize with empty data for each month of the current year
  const [monthlyData, setMonthlyData] = useState<{name: string; sales: number; supplier: number}[]>(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => ({
      name: month, 
      sales: 0, 
      supplier: 0
    }));
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get recent activity
        const activityEvents = await getRecentActivity();
        setActivityData(activityEvents);
        
        // Get invoice statistics
        const { data: invoices, error: invoiceError } = await supabase
          .from('invoice_uploads')
          .select('*');
        
        if (invoiceError) throw invoiceError;
        
        if (invoices) {
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
          const initialMonthlyData = monthlyData.map(item => ({...item, sales: 0, supplier: 0}));
          
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
              const invYear = invDate.getFullYear();
              
              // Only process current year data
              if (invYear === currentYear) {
                const monthName = new Date(currentYear, monthIndex).toLocaleString('default', { month: 'short' });
                const existingMonthIndex = initialMonthlyData.findIndex(m => m.name === monthName);
                
                if (existingMonthIndex !== -1) {
                  if (invoice.invoice_type === 'sale') {
                    initialMonthlyData[existingMonthIndex].sales += 1;
                  } else if (invoice.invoice_type === 'supplier') {
                    initialMonthlyData[existingMonthIndex].supplier += 1;
                  }
                }
              }
            }
            
            console.log('Updated monthly data:', initialMonthlyData);
          } else {
            console.log('No invoices found to process for monthly chart');
          }
          
          setMonthlyData(initialMonthlyData);
        }
        
        // Get employee statistics
        const { data: employees, error: employeeError } = await supabase
          .from('employees')
          .select('*');
        
        if (employeeError) throw employeeError;
        
        if (employees) {
          const active = employees.filter(emp => emp.status === 'active');
          const terminated = employees.filter(emp => emp.status === 'terminated');
          
          // Employees added in the last 30 days
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
          const recentlyAdded = employees.filter(emp => {
            const empDate = new Date(emp.created_at);
            return empDate >= thirtyDaysAgo;
          });
          
          setEmployeeStats({
            total: employees.length,
            active: active.length,
            terminated: terminated.length,
            recentlyAdded: recentlyAdded.length,
          });
        }
        
        // Get service statistics
        const { data: services, error: servicesError } = await supabase
          .from('service_requests')
          .select('*');
        
        if (servicesError) throw servicesError;
        
        if (services) {
          const completed = services.filter(svc => svc.status === 'completed');
          const pending = services.filter(svc => svc.status === 'pending');
          
          setServicesStats({
            completed: completed.length,
            pending: pending.length,
            requested: services.length,
          });
        }
      } catch (error) {
        console.error('Error fetching report data:', error);
        toast({
          variant: "destructive",
          title: "Error loading report data",
          description: "There was a problem loading your report data. Please try again later.",
        });
        // Use mock data as fallback
        setActivityData(getMockRecentActivity());
        
        // Also set some mock monthly data so chart is not empty
        setMonthlyData([
          { name: 'Jan', sales: 2, supplier: 1 },
          { name: 'Feb', sales: 3, supplier: 2 },
          { name: 'Mar', sales: 1, supplier: 3 },
          { name: 'Apr', sales: 4, supplier: 2 },
          { name: 'May', sales: 3, supplier: 1 },
          { name: 'Jun', sales: 5, supplier: 3 },
          { name: 'Jul', sales: 2, supplier: 4 },
          { name: 'Aug', sales: 3, supplier: 2 },
          { name: 'Sep', sales: 4, supplier: 1 },
          { name: 'Oct', sales: 1, supplier: 3 },
          { name: 'Nov', sales: 2, supplier: 2 },
          { name: 'Dec', sales: 3, supplier: 1 }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  return {
    invoiceStats,
    employeeStats,
    servicesStats,
    activityData,
    monthlyData,
    loading
  };
};
