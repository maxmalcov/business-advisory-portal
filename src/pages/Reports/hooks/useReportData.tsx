
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
  
  const [monthlyData, setMonthlyData] = useState([
    { name: 'Jan', sales: 0, supplier: 0 },
    { name: 'Feb', sales: 0, supplier: 0 },
    { name: 'Mar', sales: 0, supplier: 0 },
    { name: 'Apr', sales: 0, supplier: 0 },
    { name: 'May', sales: 0, supplier: 0 },
    { name: 'Jun', sales: 0, supplier: 0 },
  ]);

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
          
          // Prepare monthly data for chart
          const newMonthlyData = [...monthlyData];
          
          // Group by month and count
          for (const invoice of invoices) {
            const invDate = new Date(invoice.created_at);
            const monthIndex = invDate.getMonth();
            
            // Only process last 6 months
            if (monthIndex >= currentDate.getMonth() - 5 && 
                invDate.getFullYear() === currentYear) {
              const monthName = new Date(currentYear, monthIndex).toLocaleString('default', { month: 'short' });
              const existingMonthIndex = newMonthlyData.findIndex(m => m.name === monthName);
              
              if (existingMonthIndex !== -1) {
                if (invoice.invoice_type === 'sale') {
                  newMonthlyData[existingMonthIndex].sales += 1;
                } else if (invoice.invoice_type === 'supplier') {
                  newMonthlyData[existingMonthIndex].supplier += 1;
                }
              }
            }
          }
          
          setMonthlyData(newMonthlyData);
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
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast, monthlyData]);

  return {
    invoiceStats,
    employeeStats,
    servicesStats,
    activityData,
    monthlyData,
    loading
  };
};
