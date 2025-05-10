import { useState, useEffect } from 'react';
import { useActivityData } from './useActivityData';
import { useInvoiceStats } from './useInvoiceStats';
import { useEmployeeStats } from './useEmployeeStats';
import { useServiceStats } from './useServiceStats';
import { useSubscriptionStatsReports } from './useSubscriptionStatsReports';
import { ReportStats } from './types';

export type { ReportStats } from './types';

export const useReportData = (): ReportStats => {
  const [loading, setLoading] = useState(true);

  const activityData = useActivityData();
  const invoiceData = useInvoiceStats();
  const employeeData = useEmployeeStats();
  const serviceData = useServiceStats();
  const subscriptionData = useSubscriptionStatsReports();

  // Combine loading states from all hooks
  useEffect(() => {
    const isLoading =
      activityData.loading ||
      invoiceData.loading ||
      employeeData.loading ||
      serviceData.loading ||
      subscriptionData.loading;

    setLoading(isLoading);
  }, [
    activityData.loading,
    invoiceData.loading,
    employeeData.loading,
    serviceData.loading,
    subscriptionData.loading,
  ]);

  // Return combined data
  return {
    invoiceStats: invoiceData.invoiceStats,
    employeeStats: employeeData.employeeStats,
    servicesStats: serviceData.servicesStats,
    subscriptionStats: {
      total: subscriptionData.subscriptionStats.totalSubscriptions || 0,
      active: subscriptionData.subscriptionStats.activeSubscriptions || 0,
      pending:
        subscriptionData.subscriptions?.filter(
          (sub) => sub.status === 'pending',
        )?.length || 0,
    },
    activityData: activityData.activityData,
    monthlyData: invoiceData.monthlyData,
    loading,
  };
};
