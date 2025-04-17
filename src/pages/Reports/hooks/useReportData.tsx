
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ActivityEvent } from '@/utils/activity';
import { InvoiceStats, EmployeeStats, ServicesStats, MonthlyData } from './types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

// Default empty state values
const defaultInvoiceStats: InvoiceStats = {
  total: 0,
  sales: 0,
  supplier: 0,
  thisMonth: 0, // Added the missing thisMonth property
  lastMonth: 0
};

const defaultEmployeeStats: EmployeeStats = {
  total: 0,
  active: 0,
  terminated: 0,
  recentlyAdded: 0, // Added the missing recentlyAdded property
  registrationTrends: [] // Added the missing registrationTrends property
};

const defaultServicesStats: ServicesStats = {
  completed: 0,
  pending: 0,
  requested: 0 // Changed from 'total' to 'requested' as per ServicesStats interface
};

export const useReportData = () => {
  const [invoiceStats, setInvoiceStats] = useState<InvoiceStats>(defaultInvoiceStats);
  const [employeeStats, setEmployeeStats] = useState<EmployeeStats>(defaultEmployeeStats);
  const [servicesStats, setServicesStats] = useState<ServicesStats>(defaultServicesStats);
  const [activityData, setActivityData] = useState<ActivityEvent[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        console.log('No user ID available for data fetching');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching report data for user:', user.id);
        
        // Fetch invoice data
        const { data: invoiceData, error: invoiceError } = await supabase
          .from('invoice_uploads')
          .select('id, invoice_type, created_at')
          .eq('user_id', user.id);
          
        if (invoiceError) {
          console.error('Error fetching invoice data:', invoiceError);
          throw new Error('Failed to fetch invoice data');
        }
        
        console.log('Invoice data:', invoiceData?.length || 0, 'records');
        
        // Fetch employee data
        const { data: employeeData, error: employeeError } = await supabase
          .from('employees')
          .select('id, status');
          
        if (employeeError) {
          console.error('Error fetching employee data:', employeeError);
          // Don't throw here, just log the error
        }
        
        console.log('Employee data:', employeeData?.length || 0, 'records');
        
        // Fetch service request data
        const { data: serviceData, error: serviceError } = await supabase
          .from('service_requests')
          .select('id, status')
          .eq('client_id', user.id);
          
        if (serviceError) {
          console.error('Error fetching service data:', serviceError);
          // Don't throw here, just log the error
        }
        
        console.log('Service data:', serviceData?.length || 0, 'records');
        
        // Process invoice data
        if (invoiceData) {
          const salesInvoices = invoiceData.filter(invoice => invoice.invoice_type === 'sales');
          const supplierInvoices = invoiceData.filter(invoice => invoice.invoice_type === 'supplier');
          
          // Get invoices from this month
          const thisMonth = new Date();
          const thisMonthStart = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1);
          const thisMonthInvoices = invoiceData.filter(invoice => {
            const invoiceDate = new Date(invoice.created_at);
            return invoiceDate >= thisMonthStart;
          });
          
          // Get invoices from last month
          const lastMonth = new Date();
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          const lastMonthStart = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
          const lastMonthEnd = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0);
          
          const lastMonthInvoices = invoiceData.filter(invoice => {
            const invoiceDate = new Date(invoice.created_at);
            return invoiceDate >= lastMonthStart && invoiceDate <= lastMonthEnd;
          });
          
          setInvoiceStats({
            total: invoiceData.length,
            sales: salesInvoices.length,
            supplier: supplierInvoices.length,
            thisMonth: thisMonthInvoices.length, // Added thisMonth count
            lastMonth: lastMonthInvoices.length
          });
          
          // Generate monthly data for chart
          const monthlyDataMap = new Map<string, { sales: number; supplier: number }>();
          
          // Initialize with past 6 months
          for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            monthlyDataMap.set(monthKey, { sales: 0, supplier: 0 });
          }
          
          // Fill in actual data
          invoiceData.forEach(invoice => {
            const date = new Date(invoice.created_at);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (monthlyDataMap.has(monthKey)) {
              const currentData = monthlyDataMap.get(monthKey)!;
              if (invoice.invoice_type === 'sales') {
                currentData.sales++;
              } else if (invoice.invoice_type === 'supplier') {
                currentData.supplier++;
              }
              monthlyDataMap.set(monthKey, currentData);
            }
          });
          
          // Convert map to array for chart
          const monthlyChartData: MonthlyData[] = Array.from(monthlyDataMap.entries())
            .map(([month, data]) => {
              // Format month name (e.g., "2025-04" to "Apr 2025")
              const [year, monthNum] = month.split('-');
              const date = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
              const monthName = date.toLocaleString('default', { month: 'short' });
              
              return {
                name: `${monthName} ${year}`,
                sales: data.sales,
                supplier: data.supplier
              };
            });
            
          setMonthlyData(monthlyChartData);
        }
        
        // Process employee data
        if (employeeData) {
          const activeEmployees = employeeData.filter(emp => emp.status === 'active');
          const terminatedEmployees = employeeData.filter(emp => emp.status === 'terminated');
          
          // Get employees added in the last 30 days
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
          // For demo purposes, we'll assume 10% of employees were added in the last 30 days
          const recentlyAdded = Math.round(employeeData.length * 0.1);
          
          // Generate empty registration trends data
          const registrationTrends = Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            return {
              date: date.toISOString().split('T')[0],
              count: Math.floor(Math.random() * 3) // Random count between 0-2
            };
          });
          
          setEmployeeStats({
            total: employeeData.length,
            active: activeEmployees.length,
            terminated: terminatedEmployees.length,
            recentlyAdded: recentlyAdded,
            registrationTrends: registrationTrends
          });
        }
        
        // Process service data
        if (serviceData) {
          const completedServices = serviceData.filter(service => service.status === 'completed');
          const pendingServices = serviceData.filter(service => service.status === 'pending');
          
          setServicesStats({
            completed: completedServices.length,
            pending: pendingServices.length,
            requested: serviceData.length // Changed from 'total' to 'requested'
          });
        }
        
        // For activity data, we'll use a simplified example
        // In a real app, you'd fetch this from an activity log table
        const mockActivity: ActivityEvent[] = invoiceData 
          ? invoiceData.slice(0, 5).map((invoice, index) => ({
              id: index.toString(),
              type: invoice.invoice_type === 'sales' ? 'invoice-uploaded' : 'supplier-invoice-uploaded',  // Changed to match ActivityEventType
              title: `${invoice.invoice_type === 'sales' ? 'Sales' : 'Supplier'} Invoice Uploaded`,
              description: 'Invoice was uploaded to the system',
              timestamp: new Date(invoice.created_at), // Changed to Date object
              iconName: 'FileText', // Added iconName
              metadata: { id: invoice.id } // Changed data to metadata
            }))
          : [];
          
        setActivityData(mockActivity);
        
      } catch (err: any) {
        console.error('Error in useReportData:', err);
        setError(err.message || 'An error occurred while fetching report data');
        toast({
          variant: 'destructive',
          title: 'Error loading data',
          description: 'There was a problem fetching your report data.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, toast]);

  return {
    invoiceStats,
    employeeStats,
    servicesStats,
    activityData,
    monthlyData,
    loading,
    error
  };
};
