
import React from 'react';
import { PieChart } from 'lucide-react';
import StatsSummary from './components/StatsSummary';
import RecentActivity from './components/RecentActivity';
import ActivityChart from './components/ActivityChart';

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 pb-4 border-b">
        <div className="bg-primary/10 p-3 rounded-full">
          <PieChart className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage users, subscriptions, services, and overall platform operations
          </p>
        </div>
      </div>

      <StatsSummary />
      <RecentActivity />
      <ActivityChart />
    </div>
  );
};

export default AdminDashboard;

