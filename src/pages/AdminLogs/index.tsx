
import React from 'react';
import LogsHeader from './components/LogsHeader';
import LogsContent from './components/LogsContent';
import { mockLogs, chartData, weeklyData } from './mockData';

const AdminLogs: React.FC = () => {
  return (
    <div className="space-y-6">
      <LogsHeader />
      <LogsContent 
        logs={mockLogs}
        chartData={chartData}
        weeklyData={weeklyData}
      />
    </div>
  );
};

export default AdminLogs;
