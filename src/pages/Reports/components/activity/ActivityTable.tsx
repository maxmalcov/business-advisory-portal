
import React from 'react';
import { AlertCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  ActivityEvent, 
  formatTimestamp 
} from '@/utils/activity';
import ActivityIcon from './ActivityIcon';

interface ActivityTableProps {
  activityData: ActivityEvent[];
}

const EmptyState: React.FC = () => (
  <div className="py-8 text-center">
    <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
    <h3 className="text-lg font-medium">No account activity</h3>
    <p className="text-sm text-muted-foreground mt-2">
      No account activity has been recorded yet.
    </p>
  </div>
);

const ActivityTable: React.FC<ActivityTableProps> = ({ activityData }) => {
  if (activityData.length === 0) {
    return <EmptyState />;
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {activityData.map((activity) => (
          <TableRow key={activity.id}>
            <TableCell>
              <div className="flex items-center">
                <div className="mr-2 bg-muted p-2 rounded-full">
                  <ActivityIcon type={activity.type} />
                </div>
                {activity.title}
              </div>
            </TableCell>
            <TableCell>{activity.description}</TableCell>
            <TableCell>{formatTimestamp(activity.timestamp)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ActivityTable;
