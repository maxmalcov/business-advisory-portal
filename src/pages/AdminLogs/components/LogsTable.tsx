import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
import { truncateFileName, needsTruncation } from '@/utils/fileUtils';
import { useLanguage } from '@/context/LanguageContext.tsx';

interface LogsTableProps {
  logs: LogEntry[];
}

const LogsTable: React.FC<LogsTableProps> = ({ logs }) => {
  const formatDate = (dateString: string | Date) => {
    console.log(dateString);
    if (dateString instanceof Date) {
      return dateString.toLocaleString();
    }
    const date = new Date(dateString + 'Z');
    return date.toLocaleString();
  };

  const { t } = useLanguage();

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('logs.type')}</TableHead>
              <TableHead>{t('logs.action')}</TableHead>
              <TableHead>{t('logs.description')}</TableHead>
              <TableHead>{t('logs.user')}</TableHead>
              <TableHead>{t('logs.timestamp')}</TableHead>
              <TableHead>{t('logs.level')}</TableHead>
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
                  {needsTruncation(log.description) ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="inline-block max-w-[250px] truncate">
                            {truncateFileName(log.description)}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-[400px]">
                          {log.description}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <span className="inline-block max-w-[250px]">
                      {log.description}
                    </span>
                  )}
                </TableCell>
                <TableCell>{log.user}</TableCell>
                <TableCell>{formatDate(log.timestamp)}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getLogBadgeStyle(log.level)}
                  >
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
