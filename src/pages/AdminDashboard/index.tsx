
import React from 'react';
import StatsSummary from './components/StatsSummary';
import AdminActions from './components/AdminActions';
import RecentActivity from './components/RecentActivity';
import ActivityChart from './components/ActivityChart';

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <StatsSummary />
      <AdminActions />
      <RecentActivity />
      <ActivityChart />
    </div>
  );
};

export default AdminDashboard;

