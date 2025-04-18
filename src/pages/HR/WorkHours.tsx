
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useMonthlySubmissions } from './hooks/useMonthlySubmissions';
import MonthlySubmissionsView from './components/MonthlySubmissionsView';

const WorkHours: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  const { 
    selectedMonth,
    isSubmitted,
    submitMonth 
  } = useMonthlySubmissions();
  
  // Get the HR email from the user's outgoing invoice email
  const hrEmail = user?.outgoingInvoiceEmail || '';
  
  const handleSubmitToHR = async () => {
    await submitMonth(hrEmail);
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">{t('nav.hr.work_hours')}</h1>
      
      <Card>
        <CardContent className="pt-6">
          <MonthlySubmissionsView 
            isAddingNew={isAddingNew} 
            setIsAddingNew={setIsAddingNew} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkHours;
