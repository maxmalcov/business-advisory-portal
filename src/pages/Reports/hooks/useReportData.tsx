
import { useState, useEffect } from 'react';
import { useActivityData } from './useActivityData';
import { useInvoiceStats } from './useInvoiceStats';
import { useEmployeeStats } from './useEmployeeStats';
import { useServiceStats } from './useServiceStats';
import { ReportStats } from './types';

export type { ReportStats } from './types';

export const useReportData = (): ReportStats => {
  const [loading, setLoading] = useState(true);
  
  const activityData = useActivityData();
  const invoiceData = useInvoiceStats();
  const employeeData = useEmployeeStats();
  const serviceData = useServiceStats();
  
  // Combine loading states from all hooks
  useEffect(() => {
    const isLoading = 
      activityData.loading || 
      invoiceData.loading || 
      employeeData.loading || 
      serviceData.loading;
    
    setLoading(isLoading);
  }, [
    activityData.loading,
    invoiceData.loading,
    employeeData.loading,
    serviceData.loading
  ]);
  
  // Return combined data
  return {
    invoiceStats: invoiceData.invoiceStats,
    employeeStats: employeeData.employeeStats,
    servicesStats: serviceData.servicesStats,
    activityData: activityData.activityData,
    monthlyData: invoiceData.monthlyData,
    loading
  };
};
