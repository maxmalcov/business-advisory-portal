
import React from 'react';
import StatsCards from './StatsCards';
import MonthlyInvoiceChart from './MonthlyInvoiceChart';
import DistributionCharts from './DistributionCharts';
import { ActivityEvent } from '@/utils/activity';

interface OverviewTabProps {
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
  filterDataByDateRange?: (startDate: Date, endDate: Date) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  invoiceStats,
  employeeStats,
  servicesStats,
  activityData,
  monthlyData,
  filterDataByDateRange
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

  const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    if (filterDataByDateRange) {
      filterDataByDateRange(startDate, endDate);
    }
  };

  return (
    <div className="space-y-6">
      <StatsCards 
        invoiceStats={invoiceStats}
        employeeStats={employeeStats}
        servicesStats={servicesStats}
        activityData={activityData}
      />
      
      <MonthlyInvoiceChart 
        monthlyData={monthlyData} 
        onDateRangeChange={handleDateRangeChange}
      />
      
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
