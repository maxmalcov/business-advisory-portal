
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { WorkHoursHeader } from './components';
import MonthlySubmissionsView from './components/MonthlySubmissionsView';
import { useEmailRecipient } from './hooks/useEmailRecipient';

const WorkHours: React.FC = () => {
  const { t } = useLanguage();
  
  const {
    emailRecipient,
    setEmailRecipient,
    isValidEmail
  } = useEmailRecipient();
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">{t('nav.hr.work_hours')}</h1>
      
      <Card>
        <CardHeader>
          <WorkHoursHeader 
            isAddingNew={false} 
            setIsAddingNew={() => {}}
            submitToHR={() => {}}
            employeeData={[]}
          />
        </CardHeader>
        <CardContent>
          <MonthlySubmissionsView
            emailRecipient={emailRecipient}
            setEmailRecipient={setEmailRecipient}
            isValidEmail={isValidEmail}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkHours;
