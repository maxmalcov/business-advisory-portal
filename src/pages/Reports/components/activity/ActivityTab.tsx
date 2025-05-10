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
import { useIsMobile } from '@/hooks/use-mobile';

interface ActivityTabProps {
  activityData: ActivityEvent[];
}

const ActivityTab: React.FC<ActivityTabProps> = ({ activityData }) => {
  const isMobile = useIsMobile();

  return (
    <Card className={isMobile ? 'overflow-hidden' : ''}>
      <CardHeader>
        <CardTitle>Recent Account Activity</CardTitle>
        <CardDescription>
          Recent events and changes to your account
        </CardDescription>
      </CardHeader>
      <CardContent className={isMobile ? 'px-0 sm:px-6' : ''}>
        <ActivityTable activityData={activityData} />
      </CardContent>
    </Card>
  );
};

export default ActivityTab;
