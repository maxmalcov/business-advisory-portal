
import React from 'react';
import { 
  FileText, 
  UserMinus, 
  UserPlus, 
  AlertCircle, 
  FileUp,
  Calendar
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

const truncateFileName = (fileName: string, maxLength: number = 40) => {
  if (fileName.length <= maxLength) return fileName;
  
  // For filenames with extension, preserve the extension
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex !== -1) {
    const extension = fileName.slice(lastDotIndex);
    const name = fileName.slice(0, lastDotIndex);
    if (name.length <= maxLength - 5) return fileName; // If name is already short enough
    
    return `${name.slice(0, maxLength - 5)}...${extension}`;
  }
  
  // For filenames without extension
  return `${fileName.slice(0, maxLength)}...`;
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
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activityData.map((activity) => {
            // Determine icon based on activity type
            let ActivityIcon;
            switch (activity.type) {
              case 'employee-added':
                ActivityIcon = UserPlus;
                break;
              case 'employee-terminated':
                ActivityIcon = UserMinus;
                break;
              case 'invoice-uploaded':
              case 'supplier-invoice-uploaded':
                ActivityIcon = FileUp;
                break;
              case 'service-completed':
                ActivityIcon = FileText;
                break;
              default:
                ActivityIcon = Calendar;
            }
            
            // Check if description contains a long filename
            const needsTruncation = activity.description && 
              (activity.description.includes('.pdf') || activity.description.length > 60);
            const displayDescription = needsTruncation ? 
              truncateFileName(activity.description, 60) : 
              activity.description;
                
            return (
              <TableRow key={activity.id} className="hover:bg-muted/50">
                <TableCell className="py-4">
                  <div className="flex items-center">
                    <div className="mr-3 bg-muted rounded-full p-2 flex-shrink-0">
                      <ActivityIcon className="h-5 w-5" />
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
                  {formatTimestamp(activity.timestamp)}
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
