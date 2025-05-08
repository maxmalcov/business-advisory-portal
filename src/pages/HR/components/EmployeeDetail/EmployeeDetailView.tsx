
import React from 'react';
import { Employee } from '../../types/employee';
import { Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  IdentificationSection,
  HeaderSection,
  BasicInfoCard,
  EmploymentDatesCard,
  FinancialInfoCard,
  ContactInfoCard,
  CommentsCard
} from './index';
import { formatDate } from './utils/dateUtils';
import {useLanguage} from "@/context/LanguageContext.tsx";

interface EmployeeDetailViewProps {
  employee: Employee;
}

const EmployeeDetailView: React.FC<EmployeeDetailViewProps> = ({ employee }) => {
  const {t} = useLanguage()

  return (
    <div className="space-y-6">
      {/* Header Section with Avatar and Title */}
      <HeaderSection employee={employee} />
      
      {/* Basic Information Card */}
      <BasicInfoCard employee={employee} />
      
      {/* Employment Dates Card */}
      <EmploymentDatesCard employee={employee} formatDate={formatDate} />
      
      {/* Identification Card - Using the dedicated component */}
      <IdentificationSection employee={employee} />
      
      {/* Financial Information Card */}
      <FinancialInfoCard employee={employee} />
      
      {/* Contact Information */}
      <ContactInfoCard employee={employee} />
      
      {/* Schedule Card */}
      <Card className="overflow-hidden border border-border shadow-sm">
        <div className="bg-muted/30 px-6 py-3 border-b border-border">
          <h3 className="text-md font-medium flex items-center text-foreground">
            <Clock className="h-4 w-4 mr-2 text-primary" />
              {t('hr.index.employee.schedule')}
          </h3>
        </div>
        <CardContent className="pt-4 bg-card">
          {employee.weeklySchedule ? (
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('hr.index.employee.schedule.weekly')}</p>
              <p className="text-sm font-semibold whitespace-pre-line mt-1 text-foreground">{employee.weeklySchedule}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">{t('hr.index.employee.schedule.not-found')}</p>
          )}
        </CardContent>
      </Card>
      
      {/* Comments Section */}
      <CommentsCard employee={employee} />
    </div>
  );
};

export default EmployeeDetailView;
