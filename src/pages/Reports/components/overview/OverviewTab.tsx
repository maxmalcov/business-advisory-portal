
import React from 'react';
import StatsCards from './StatsCards';
import MonthlyInvoiceChart from './MonthlyInvoiceChart';
import DistributionCharts from './DistributionCharts';

interface OverviewTabProps {
  invoiceStats: any;
  employeeStats: any;
  servicesStats: any;
  activityData: any;
  monthlyData: any;
  onTabChange: (tab: string) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  invoiceStats,
  employeeStats,
  servicesStats,
  activityData,
  monthlyData,
  onTabChange
}) => {
  return (
    <div className="space-y-6">
      <StatsCards 
        invoiceStats={invoiceStats}
        employeeStats={employeeStats}
        servicesStats={servicesStats}
        activityData={activityData}
        onTabChange={onTabChange}
      />
      <MonthlyInvoiceChart data={monthlyData} />
      <DistributionCharts />
    </div>
  );
};

export default OverviewTab;
