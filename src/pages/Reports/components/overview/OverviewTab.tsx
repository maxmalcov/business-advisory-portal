
import React from 'react';
import StatsCards from './StatsCards';
import MonthlyInvoiceChart from './MonthlyInvoiceChart';
import DistributionCharts from './DistributionCharts';
import { ActivityEvent } from '@/utils/activity';
import { InvoiceStats, EmployeeStats, ServicesStats, MonthlyData } from '../../hooks/types';

interface OverviewTabProps {
  invoiceStats: InvoiceStats;
  employeeStats: EmployeeStats;
  servicesStats: ServicesStats;
  activityData: ActivityEvent[];
  monthlyData: MonthlyData[];
  onCardClick: (tab: string) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  invoiceStats,
  employeeStats,
  servicesStats,
  activityData,
  monthlyData,
  onCardClick,
}) => {
  // Colors for charts
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];
  
  // Prepare data for pie charts
  const invoicePieData = [
    { name: 'Sales', value: invoiceStats.sales },
    { name: 'Supplier', value: invoiceStats.supplier },
  ];
  
  const employeePieData = [
    { name: 'Active', value: employeeStats.active },
    { name: 'Terminated', value: employeeStats.terminated },
  ];
  
  const servicesPieData = [
    { name: 'Completed', value: servicesStats.completed },
    { name: 'Pending', value: servicesStats.pending },
  ];

  return (
    <div className="space-y-6">
      <StatsCards 
        invoiceStats={invoiceStats}
        employeeStats={employeeStats}
        servicesStats={servicesStats}
        activityData={activityData}
        onCardClick={onCardClick}
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
