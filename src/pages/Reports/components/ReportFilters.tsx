
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ResetIcon, FilterIcon } from 'lucide-react';
import { ReportFilters } from '../types';
import { useLanguage } from '@/context/LanguageContext';

interface ReportFiltersProps {
  filters: ReportFilters;
  onFilterChange: (key: keyof ReportFilters, value: string | null) => void;
  onResetFilters: () => void;
}

const ReportFilters: React.FC<ReportFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-card rounded-lg p-4 shadow">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h3 className="font-medium text-sm flex items-center">
          <FilterIcon className="h-4 w-4 mr-2" />
          {t('reports.filter')}
        </h3>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <Select 
            value={filters.type || ""} 
            onValueChange={(value) => onFilterChange('type', value || null)}
          >
            <SelectTrigger className="w-full md:w-[140px]">
              <SelectValue placeholder={t('reports.type')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="financial">Financial</SelectItem>
              <SelectItem value="tax">Tax</SelectItem>
              <SelectItem value="payroll">Payroll</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={filters.status || ""} 
            onValueChange={(value) => onFilterChange('status', value || null)}
          >
            <SelectTrigger className="w-full md:w-[140px]">
              <SelectValue placeholder={t('reports.status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={filters.period || ""} 
            onValueChange={(value) => onFilterChange('period', value || null)}
          >
            <SelectTrigger className="w-full md:w-[140px]">
              <SelectValue placeholder={t('reports.period')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Periods</SelectItem>
              <SelectItem value="Q1 2025">Q1 2025</SelectItem>
              <SelectItem value="Q2 2025">Q2 2025</SelectItem>
              <SelectItem value="March 2025">March 2025</SelectItem>
              <SelectItem value="April 2025">April 2025</SelectItem>
              <SelectItem value="FY 2024">FY 2024</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline" size="sm" onClick={onResetFilters} className="whitespace-nowrap">
          <ResetIcon className="h-4 w-4 mr-2" />
          {t('reports.reset_filters')}
        </Button>
      </div>
    </div>
  );
};

export default ReportFilters;
