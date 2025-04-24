
import React from 'react';
import { Activity } from 'lucide-react';

const LogsHeader: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">System Log History</h1>
            <p className="text-muted-foreground mt-1">
              Track and monitor all system activities and events
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogsHeader;
