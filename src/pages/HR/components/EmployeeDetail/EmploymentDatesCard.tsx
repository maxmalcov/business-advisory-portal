import React from 'react';
import { Employee } from '../../types/employee';
import { Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext.tsx';

interface EmploymentDatesCardProps {
  employee: Employee;
  formatDate: (dateString: string | undefined) => string;
}

const EmploymentDatesCard: React.FC<EmploymentDatesCardProps> = ({
  employee,
  formatDate,
}) => {
  const { t } = useLanguage();

  return (
    <Card className="overflow-hidden border border-border shadow-sm">
      <div className="bg-muted/30 px-6 py-3 border-b border-border">
        <h3 className="text-md font-medium flex items-center text-foreground">
          <Calendar className="h-4 w-4 mr-2 text-primary" />
          {t('hr.index.employee.details.dates.employment')}
        </h3>
      </div>
      <CardContent className="pt-4 grid grid-cols-2 gap-4 bg-card">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {t('hr.index.employee.details.dates.start')}
          </p>
          <p className="text-sm font-semibold text-foreground">
            {employee.startDate ? formatDate(employee.startDate) : '-'}
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {t('hr.index.employee.details.dates.end')}
          </p>
          <p className="text-sm font-semibold text-foreground">
            {employee.endDate
              ? formatDate(employee.endDate)
              : employee.status === 'active'
                ? t('hr.index.employee.details.dates.current')
                : '-'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmploymentDatesCard;
