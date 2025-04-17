
import React from 'react';
import { format, isSameMonth, isAfter, startOfMonth, addMonths } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Check, Clock, ChevronLeft, ChevronRight, LockIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MonthSubmission } from '../hooks/useMonthlySubmissions';
import YearSelector from './YearSelector';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface MonthSelectorProps {
  months: MonthSubmission[];
  selectedMonth: Date;
  onSelectMonth: (month: Date) => void;
  loading?: boolean;
  onYearChange: (year: number) => void;
  selectedYear: number;
  onNavigateMonth: (direction: 'prev' | 'next') => void;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({ 
  months, 
  selectedMonth, 
  onSelectMonth,
  loading = false,
  onYearChange,
  selectedYear,
  onNavigateMonth
}) => {
  const currentDate = new Date();
  const today = startOfMonth(currentDate);
  const isCurrentYear = selectedYear === currentDate.getFullYear();
  const filteredMonths = months.filter(month => month.date.getFullYear() === selectedYear);
  
  const canNavigateNext = !isAfter(
    startOfMonth(addMonths(selectedMonth, 1)), 
    today
  );
  
  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <YearSelector 
          selectedYear={selectedYear} 
          onYearChange={onYearChange} 
        />
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onNavigateMonth('prev')}
            disabled={loading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onNavigateMonth('next')}
            disabled={loading || !canNavigateNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex items-center gap-2">
          <Clock className="animate-spin h-4 w-4" />
          <span>Loading months...</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {filteredMonths.map((month) => {
            const isSelected = isSameMonth(month.date, selectedMonth);
            const isCurrentMonth = month.isCurrentMonth && isCurrentYear;
            const isFutureMonth = month.isFutureMonth;
            
            if (isFutureMonth) {
              return (
                <TooltipProvider key={month.date.toISOString()}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "relative h-auto py-2 px-3 w-full justify-start border rounded-md opacity-50 cursor-not-allowed",
                          "bg-muted text-muted-foreground"
                        )}
                      >
                        <div className="flex items-center w-full">
                          <Calendar className="mr-2 h-4 w-4" />
                          <span className="truncate">{format(month.date, 'MMMM')}</span>
                          <LockIcon className="ml-auto h-3 w-3" />
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>You can only submit current or past months</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            }
            
            return (
              <Button
                key={month.date.toISOString()}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className={cn(
                  "relative h-auto py-2 px-3 w-full justify-start",
                  isSelected ? "shadow-md" : "",
                  isCurrentMonth ? "ring-2 ring-primary ring-offset-1" : ""
                )}
                onClick={() => onSelectMonth(month.date)}
                disabled={loading}
              >
                <div className="flex items-center w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span className="truncate">{format(month.date, 'MMMM')}</span>
                  
                  {month.status === 'submitted' ? (
                    <span className="ml-auto flex items-center text-green-500" title="Submitted">
                      <Check className="h-4 w-4" />
                    </span>
                  ) : (
                    <span className="ml-auto flex items-center text-amber-500" title="Pending">
                      <Clock className="h-4 w-4" />
                    </span>
                  )}
                </div>
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MonthSelector;
