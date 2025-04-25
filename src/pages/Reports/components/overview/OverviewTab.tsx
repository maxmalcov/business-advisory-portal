
import React from 'react';
import StatsCards from './StatsCards';
import MonthlyInvoiceChart from './MonthlyInvoiceChart';
import DistributionCharts from './DistributionCharts';

interface OverviewTabProps {
  invoiceStats: any;
  employeeStats: any;
  servicesStats: any;
  subscriptionStats: {
    total: number;
    active: number;
    pending: number;
  };
  monthlyData: any;
  onTabChange: (tab: string) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  invoiceStats,
  employeeStats,
  servicesStats,
  subscriptionStats,
  monthlyData,
  onTabChange
}) => {
  // Colors for charts
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];
  
  // Prepare data for pie charts
  const invoicePieData = [
    { name: 'Sales', value: invoiceStats?.sales || 0 },
    { name: 'Supplier', value: invoiceStats?.supplier || 0 },
  ];
  
  const employeePieData = [
    { name: 'Active', value: employeeStats?.active || 0 },
    { name: 'Terminated', value: employeeStats?.terminated || 0 },
  ];
  
  const servicesPieData = [
    { name: 'Completed', value: servicesStats?.completed || 0 },
    { name: 'Pending', value: servicesStats?.pending || 0 },
  ];

  return (
    <div className="space-y-6">
      <StatsCards 
        invoiceStats={invoiceStats}
        employeeStats={employeeStats}
        servicesStats={servicesStats}
        subscriptionStats={subscriptionStats}
        onTabChange={onTabChange}
      />
      <MonthlyInvoiceChart monthlyData={monthlyData} />
      <DistributionCharts 
        invoicePieData={invoicePieData}
        employeePieData={employeePieData}
        servicesPieData={servicesPieData}
        colors={COLORS}
      />
    </div>
  );
};

export default OverviewTab;
