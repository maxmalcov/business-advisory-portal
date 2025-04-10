
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { ActivityEvent } from '@/utils/activity';
import ActivityTable from './ActivityTable';

interface ActivityTabProps {
  activityData: ActivityEvent[];
}

const ActivityTab: React.FC<ActivityTabProps> = ({ activityData }) => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Recent Account Activity</CardTitle>
        <CardDescription className="text-base">
          Recent events and changes to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ActivityTable activityData={activityData} />
      </CardContent>
    </Card>
  );
};

export default ActivityTab;
