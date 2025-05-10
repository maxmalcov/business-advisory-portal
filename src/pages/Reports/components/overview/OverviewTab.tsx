import React, { useEffect, useState } from 'react';
import StatsCards from './StatsCards';
import MonthlyInvoiceChart from './MonthlyInvoiceChart';
import DistributionCharts from './DistributionCharts';
import { supabase } from '@/integrations/supabase/client.ts';

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
  onTabChange,
}) => {
  // Colors for charts
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];
  const [invoicePieData, setInvoicePieData] = useState([]);
  const [employeePieData, setEmployeePieData] = useState([]);
  const [servicesPieData, setServicesPieData] = useState([]);

  useEffect(() => {
    (async () => {
      const { error, data } = await supabase.from('invoice_files').select('*');

      if (error) {
        throw new Error('DB error');
      }

      const [sales, suppliers] = [
        data.filter((i) => i.invoice_type === 'sale'),
        data.filter((i) => i.invoice_type === 'supplier'),
      ];

      setInvoicePieData([
        { name: 'Sales', value: sales.length },
        { name: 'Supplier', value: suppliers.length },
      ]);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { error, data } = await supabase.from('employees').select('*');

      if (error) {
        throw new Error('DB error');
      }

      const [active, terminated] = [
        data.filter((i) => i.status === 'active'),
        data.filter((i) => i.status === 'terminated'),
      ];

      setEmployeePieData([
        { name: 'Active', value: active.length },
        { name: 'Terminated', value: terminated.length },
      ]);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { error, data } = await supabase
        .from('service_requests')
        .select('*');

      if (error) {
        throw new Error('DB error');
      }

      const [active, pending] = [
        data.filter((i) => i.status === 'completed'),
        data.filter((i) => i.status === 'rejected'),
      ];

      setServicesPieData([
        { name: 'Active', value: active.length },
        { name: 'Rejected', value: pending.length },
      ]);
    })();
  }, []);

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
