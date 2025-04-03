
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

const LogsHeader: React.FC = () => {
  return (
    <Card className="border-l-4 border-l-ba-blue">
      <CardHeader>
        <CardTitle className="text-2xl">System Log History</CardTitle>
        <CardDescription>
          Detailed log of all system activity and events
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default LogsHeader;
