
import React, {useEffect, useState} from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import WorkHoursHeader from './components/WorkHoursHeader';
import WorkHoursCardHeader from './components/WorkHoursCardHeader';
import MonthlySubmissionsView from './components/MonthlySubmissionsView';
import { useAuth } from '@/context/AuthContext';
import {useMonthlySubmissions as useMonthlySubmissionsData, useMonthlySubmissions} from './hooks/useMonthlySubmissions';
import {employeeWorkHoursTable} from "@/integrations/supabase/client.ts";

const WorkHours: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [employees, setEmployees] = useState([])

  const {
    months,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    onYearChange,
    onNavigateMonth,
    isSubmitted,
    loading: submissionsLoading,
    submitMonth
  } = useMonthlySubmissionsData();

  useEffect(() => {
    (async () => {
      const {data} = await employeeWorkHoursTable().select('*').eq('month_year', `${selectedMonth.getFullYear()}-0${selectedMonth.getMonth()+1}`)
      console.log(data)

      setEmployees(data)
    })()
  }, [selectedMonth]);
  
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
            employeeData={employees}
            selectedMonth={selectedMonth}
          />
        </CardHeader>
        <CardContent>
          <MonthlySubmissionsView
            isAddingNew={isAddingNew}
            setIsAddingNew={setIsAddingNew}
            months={months}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedYear={selectedYear}
            onYearChange={onYearChange}
            onNavigateMonth={onNavigateMonth}
            isSubmitted={isSubmitted}
            submissionsLoading={submissionsLoading}
            submitMonth={submitMonth}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkHours;
