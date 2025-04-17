
import React from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MonthSubmission } from '../hooks/useMonthlySubmissions';

interface MonthSelectorProps {
  months: MonthSubmission[];
  selectedMonth: Date;
  onSelectMonth: (month: Date) => void;
  loading?: boolean;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({ 
  months, 
  selectedMonth, 
  onSelectMonth,
  loading = false 
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {loading ? (
        <div className="flex items-center gap-2">
          <Clock className="animate-spin h-4 w-4" />
          <span>Loading months...</span>
        </div>
      ) : (
        months.map((month) => (
          <Button
            key={month.date.toISOString()}
            variant={month.date.getTime() === selectedMonth.getTime() ? "default" : "outline"}
            size="sm"
            className={cn(
              "relative h-auto py-1.5 px-3",
              month.date.getTime() === selectedMonth.getTime() ? "shadow-md" : ""
            )}
            onClick={() => onSelectMonth(month.date)}
            disabled={loading}
          >
            <Calendar className="mr-2 h-4 w-4" />
            <span>{format(month.date, 'MMMM yyyy')}</span>
            
            {month.status === 'submitted' && (
              <Badge 
                variant="secondary" 
                className="absolute -top-2 -right-2 text-xs"
              >
                Submitted
              </Badge>
            )}
            
            {month.isCurrentMonth && (
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-1 w-1 bg-primary rounded-full"></span>
            )}
          </Button>
        ))
      )}
    </div>
  );
};

export default MonthSelector;
