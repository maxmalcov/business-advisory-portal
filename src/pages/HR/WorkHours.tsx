
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { WorkHoursHeader } from './components';
import MonthlySubmissionsView from './components/MonthlySubmissionsView';
import { useEmailRecipient } from './hooks/useEmailRecipient';
import { useMonthlySubmissions } from './hooks/useMonthlySubmissions';

const WorkHours: React.FC = () => {
  const { t } = useLanguage();
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  const {
    emailRecipient,
    setEmailRecipient,
    isValidEmail
  } = useEmailRecipient();

  const { 
    selectedMonth,
    isSubmitted,
    submitMonth
  } = useMonthlySubmissions();
  
  const handleSubmitToHR = async () => {
    if (isValidEmail) {
      await submitMonth(emailRecipient);
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">{t('nav.hr.work_hours')}</h1>
      
      <Card>
        <CardHeader>
          <WorkHoursHeader 
            isAddingNew={isAddingNew} 
            setIsAddingNew={setIsAddingNew}
            submitToHR={handleSubmitToHR}
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
