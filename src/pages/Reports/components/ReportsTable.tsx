
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  DownloadIcon, 
  EyeIcon, 
  RefreshCw
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ReportData } from '../types';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface ReportsTableProps {
  reports: ReportData[];
  isFiltered: boolean;
}

const ReportsTable: React.FC<ReportsTableProps> = ({ reports, isFiltered }) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Processing</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getReportTypeBadge = (type: string) => {
    switch (type) {
      case 'financial':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-100">Financial</Badge>;
      case 'tax':
        return <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">Tax</Badge>;
      case 'payroll':
        return <Badge variant="secondary" className="bg-sky-100 text-sky-800 hover:bg-sky-100">Payroll</Badge>;
      case 'custom':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Custom</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const handleViewReport = (report: ReportData) => {
    toast({
      title: "Opening Report",
      description: `Opening ${report.name}`,
    });
  };

  const handleDownloadReport = (report: ReportData) => {
    toast({
      title: "Downloading Report",
      description: `${report.name} is being downloaded`,
    });
  };

  return (
    <div className="overflow-hidden rounded-md border shadow">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('reports.table.name')}</TableHead>
              <TableHead className="hidden sm:table-cell">{t('reports.table.type')}</TableHead>
              <TableHead className="hidden md:table-cell">{t('reports.table.period')}</TableHead>
              <TableHead className="hidden md:table-cell">{t('reports.table.date')}</TableHead>
              <TableHead>{t('reports.table.status')}</TableHead>
              <TableHead className="text-right">{t('reports.table.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length > 0 ? (
              reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">
                    <div>
                      {report.name}
                      <div className="md:hidden mt-1 flex flex-col gap-1">
                        <div className="sm:hidden">{getReportTypeBadge(report.type)}</div>
                        <div className="md:hidden text-xs text-muted-foreground">
                          {report.period} · {new Date(report.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{getReportTypeBadge(report.type)}</TableCell>
                  <TableCell className="hidden md:table-cell">{report.period}</TableCell>
                  <TableCell className="hidden md:table-cell">{new Date(report.date).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewReport(report)}
                        aria-label="View report"
                      >
                        <EyeIcon className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      {report.status === 'completed' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDownloadReport(report)}
                          aria-label="Download report"
                        >
                          <DownloadIcon className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  {isFiltered ? (
                    <div className="flex flex-col items-center gap-2">
                      <p>{t('reports.no_results')}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw className="h-8 w-8 text-muted-foreground/60 animate-spin" />
                      <p>{t('reports.no_data')}</p>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ReportsTable;
