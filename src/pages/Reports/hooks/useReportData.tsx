
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ActivityEvent, getRecentActivity, getMockRecentActivity } from '@/utils/activity';
import { format, parseISO, subMonths } from 'date-fns';

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
    date?: Date;
  }[];
  loading: boolean;
  filterDataByDateRange: (startDate: Date, endDate: Date) => void;
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
  
  const [allMonthlyData, setAllMonthlyData] = useState<{
    name: string;
    sales: number;
    supplier: number;
    date?: Date;
  }[]>([]);
  
  const [monthlyData, setMonthlyData] = useState<{
    name: string;
    sales: number;
    supplier: number;
    date?: Date;
  }[]>([]);

  const prepareMonthlyData = useCallback((invoices: any[], startDate: Date, endDate: Date) => {
    const monthMap = new Map();
    const currentDate = new Date();
    
    // Initialize with empty data for all months in the range
    let currentMonth = new Date(startDate);
    while (currentMonth <= endDate) {
      const monthName = format(currentMonth, 'MMM');
      const monthYear = format(currentMonth, 'yyyy-MM');
      
      if (!monthMap.has(monthYear)) {
        monthMap.set(monthYear, {
          name: monthName,
          sales: 0,
          supplier: 0,
          date: new Date(currentMonth)
        });
      }
      
      // Move to next month
      currentMonth.setMonth(currentMonth.getMonth() + 1);
    }
    
    // Fill with actual data
    for (const invoice of invoices) {
      try {
        const invDate = parseISO(invoice.created_at);
        if (invDate >= startDate && invDate <= endDate) {
          const monthYear = format(invDate, 'yyyy-MM');
          const monthName = format(invDate, 'MMM');
          
          if (!monthMap.has(monthYear)) {
            monthMap.set(monthYear, {
              name: monthName,
              sales: 0,
              supplier: 0,
              date: new Date(invDate.getFullYear(), invDate.getMonth(), 1)
            });
          }
          
          const monthData = monthMap.get(monthYear);
          if (invoice.invoice_type === 'sale') {
            monthData.sales += 1;
          } else if (invoice.invoice_type === 'supplier') {
            monthData.supplier += 1;
          }
        }
      } catch (error) {
        console.error('Error processing invoice date:', error);
      }
    }
    
    // Convert map to array and sort by date
    const result = Array.from(monthMap.values()).sort((a, b) => {
      return a.date && b.date ? a.date.getTime() - b.date.getTime() : 0;
    });
    
    return result;
  }, []);
  
  const filterDataByDateRange = useCallback((startDate: Date, endDate: Date) => {
    if (!allMonthlyData.length) return;
    
    const filtered = allMonthlyData.filter(item => {
      if (!item.date) return false;
      return item.date >= startDate && item.date <= endDate;
    });
    
    setMonthlyData(filtered);
  }, [allMonthlyData]);

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
          
          // Default date range: last 6 months
          const defaultEndDate = new Date();
          const defaultStartDate = subMonths(defaultEndDate, 5);
          
          // Prepare all monthly data for filtering
          const allData = prepareMonthlyData(invoices, subMonths(currentDate, 23), currentDate);
          setAllMonthlyData(allData);
          
          // Set initial filtered view
          const initialFiltered = prepareMonthlyData(invoices, defaultStartDate, defaultEndDate);
          setMonthlyData(initialFiltered);
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
  }, [toast, prepareMonthlyData]);

  return {
    invoiceStats,
    employeeStats,
    servicesStats,
    activityData,
    monthlyData,
    loading,
    filterDataByDateRange
  };
};
