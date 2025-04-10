
import React from 'react';
import { 
  AlertCircle
} from 'lucide-react';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';

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

const truncateText = (text: string, maxLength: number = 50) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

const formatDate = (date: Date) => {
  return format(date, "MMMM d, yyyy – HH:mm");
};

const ActivityTable: React.FC<ActivityTableProps> = ({ activityData }) => {
  if (activityData.length === 0) {
    return <EmptyState />;
  }
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[200px]">Type</TableHead>
            <TableHead className="w-[45%]">Description</TableHead>
            <TableHead className="text-right w-[220px]">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activityData.map((activity) => {
            const displayDescription = truncateText(activity.description, 50);
            const needsTruncation = activity.description && activity.description.length > 50;
                
            return (
              <TableRow key={activity.id} className="hover:bg-muted/50">
                <TableCell className="py-4">
                  <div className="flex items-center">
                    <div className="mr-3 bg-muted rounded-full p-2 flex-shrink-0">
                      <ActivityIcon type={activity.type} />
                    </div>
                    <span className="font-medium">{activity.title}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {needsTruncation ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="line-clamp-2">{displayDescription}</span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          <p>{activity.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <span>{displayDescription}</span>
                  )}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap text-muted-foreground">
                  {formatDate(activity.timestamp)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ActivityTable;
