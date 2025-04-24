
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import WorkHoursHeader from './components/WorkHoursHeader';
import WorkHoursCardHeader from './components/WorkHoursCardHeader';
import MonthlySubmissionsView from './components/MonthlySubmissionsView';
import { useAuth } from '@/context/AuthContext';
import { useMonthlySubmissions } from './hooks/useMonthlySubmissions';

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
      <WorkHoursHeader />
      
      <Card>
        <CardHeader>
          <WorkHoursCardHeader 
            isAddingNew={isAddingNew} 
            setIsAddingNew={setIsAddingNew}
            submitToHR={handleSubmitToHR}
            employeeData={[]}
          />
        </CardHeader>
        <CardContent>
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
