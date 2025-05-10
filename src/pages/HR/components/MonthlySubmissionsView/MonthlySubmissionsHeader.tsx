import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarCheck } from 'lucide-react';
import { formatMonthYear } from '@/utils/dates';

interface MonthlySubmissionsHeaderProps {
  selectedMonth: Date;
  isSubmitted: boolean;
}

const MonthlySubmissionsHeader: React.FC<MonthlySubmissionsHeaderProps> = ({
  selectedMonth,
  isSubmitted,
}) => {
  return (
    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
      <CardTitle className="flex items-center text-xl">
        <CalendarCheck className="mr-2 h-5 w-5" />
        {formatMonthYear(selectedMonth)}
        {isSubmitted && (
          <Badge
            variant="outline"
            className="ml-3 bg-green-50 border-green-200 text-green-700"
          >
            Submitted
          </Badge>
        )}
      </CardTitle>
    </CardHeader>
  );
};

export default MonthlySubmissionsHeader;
