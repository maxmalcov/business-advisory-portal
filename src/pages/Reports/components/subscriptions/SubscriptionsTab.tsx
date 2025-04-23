
import React from 'react';
import { useSubscriptionStatsReports } from '../../hooks/useSubscriptionStatsReports';
import SubscriptionFilters from './SubscriptionFilters';
import SubscriptionStatsCards from './SubscriptionStatsCards';
import SubscriptionChartView from './SubscriptionChartView';
import SubscriptionTable from './SubscriptionTable';

const SubscriptionsTab: React.FC = () => {
  const { 
    subscriptionStats, 
    subscriptions, 
    chartData, 
    loading, 
    filters, 
    setFilters,
    exportToCSV
  } = useSubscriptionStatsReports();

  return (
    <div className="space-y-8">
      <SubscriptionFilters 
        filters={filters}
        setFilters={setFilters}
        onExport={exportToCSV}
        totalItems={subscriptions.length}
        loading={loading}
      />

      <SubscriptionStatsCards stats={subscriptionStats} loading={loading} />
      
      <div className="mb-10">
        <SubscriptionChartView data={chartData} loading={loading} />
      </div>
      
      <div className="mt-10">
        <h3 className="text-lg font-medium mb-4">Subscription Details</h3>
        <SubscriptionTable subscriptions={subscriptions} loading={loading} />
      </div>
    </div>
  );
};

export default SubscriptionsTab;
