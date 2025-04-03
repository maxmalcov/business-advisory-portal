
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ReportFilters from './components/ReportFilters';
import ReportCharts from './components/ReportCharts';
import ReportsTable from './components/ReportsTable';
import { useReports } from './hooks/useReports';
import { reportsTypesData, monthlyReportsData, reportStatusData } from './mockData';
import { Button } from '@/components/ui/button';
import { ChartPieIcon, FileTextIcon, DownloadIcon, PlusIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Reports: React.FC = () => {
  const { t } = useLanguage();
  const { reports, filters, handleFilterChange, resetFilters, isFiltered } = useReports();
  const { toast } = useToast();

  const handleGenerateReport = () => {
    toast({
      title: "Report Generator",
      description: "The report generator feature will be available soon.",
    });
  };
  
  const handleExportAll = () => {
    toast({
      title: "Export Reports",
      description: "Exporting all available reports...",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('nav.reports')}</h1>
          <p className="text-muted-foreground">{t('reports.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportAll}>
            <DownloadIcon className="mr-2 h-4 w-4" />
            {t('reports.export_all')}
          </Button>
          <Button onClick={handleGenerateReport}>
            <PlusIcon className="mr-2 h-4 w-4" />
            {t('reports.generate')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex flex-col space-y-0.5">
              <CardTitle className="text-lg">{t('reports.total_reports')}</CardTitle>
              <CardDescription>{t('reports.accessible_reports')}</CardDescription>
            </div>
            <ChartPieIcon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex flex-col space-y-0.5">
              <CardTitle className="text-lg">{t('reports.completed_reports')}</CardTitle>
              <CardDescription>{t('reports.processed_reports')}</CardDescription>
            </div>
            <FileTextIcon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">
              +4% from last month
            </p>
          </CardContent>
        </Card>
      </div>
      
      <ReportCharts 
        typesData={reportsTypesData}
        monthlyData={monthlyReportsData}
        statusData={reportStatusData}
      />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{t('reports.available_reports')}</h2>
        <ReportFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={resetFilters}
        />
        
        <ReportsTable 
          reports={reports}
          isFiltered={isFiltered}
        />
      </div>
    </div>
  );
};

export default Reports;
