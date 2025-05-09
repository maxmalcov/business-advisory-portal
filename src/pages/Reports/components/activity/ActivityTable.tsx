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
import { ActivityEvent, formatTimestamp } from '@/utils/activity';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { truncateFileName, needsTruncation } from '@/utils/fileUtils';
import { getLogIcon } from '@/pages/AdminLogs/utils.tsx';

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

  // Function to add tooltips to file names in description text
  const formatDescription = (description: string) => {
    // Check if the description contains quotes (likely indicating a file name)
    const fileNameMatch = description.match(/"([^"]+)"/);

    if (fileNameMatch && fileNameMatch[1]) {
      const fileName = fileNameMatch[1];

      if (needsTruncation(fileName)) {
        const truncatedName = truncateFileName(fileName);
        const parts = description.split(`"${fileName}"`);

        return (
          <>
            {parts[0]}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="font-medium">"{truncatedName}"</span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[400px]">
                  {fileName}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {parts[1]}
          </>
        );
      }
    }

    return description;
  };

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
                  {getLogIcon(activity.type)}
                </div>
                {activity.title}
              </div>
            </TableCell>
            <TableCell>{formatDescription(activity.description)}</TableCell>
            <TableCell>{`${String(activity.timestamp.getDate()).padStart(2, '0')}-${String(activity.timestamp.getMonth() + 1).padStart(2, '0')}-${activity.timestamp.getFullYear()}`}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ActivityTable;
