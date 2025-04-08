
import React from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LogEntry } from '../types';
import { getLogIcon, getLogBadgeStyle } from '../utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface LogsTableProps {
  logs: LogEntry[];
}

const LogsTable: React.FC<LogsTableProps> = ({ logs }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Function to truncate text longer than 50 characters
  const truncateText = (text: string): string => {
    return text.length > 50 ? `${text.substring(0, 47)}...` : text;
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <div className="bg-muted p-1.5 rounded-md inline-flex">
                    {getLogIcon(log.category)}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{log.action}</TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-block max-w-[250px] truncate">
                          {truncateText(log.description)}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[400px]">
                        {log.description}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>{log.user}</TableCell>
                <TableCell>{formatDate(log.timestamp)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getLogBadgeStyle(log.level)}>
                    {log.level}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LogsTable;

