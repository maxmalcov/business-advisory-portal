
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEmployeeData } from './hooks/useEmployeeData';
import TerminationForm from './components/TerminationForm';
import EmployeeInfoCard from './components/EmployeeInfoCard';
import TerminationHeader from './components/TerminationHeader';

const Termination: React.FC = () => {
  const { t } = useLanguage();
  const { employees, isLoading } = useEmployeeData();
  
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [additionalVacationDays, setAdditionalVacationDays] = useState<string>('0');
  
  const selectedEmployeeData = employees.find(emp => emp.id === selectedEmployee);
  
  return (
    <div className="space-y-6">
      <TerminationHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t('hr.termination.formTitle', 'Termination Form')}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <p>Loading employee data...</p>
              </div>
            ) : (
              <TerminationForm 
                employees={employees} 
                selectedEmployee={selectedEmployee}
                setSelectedEmployee={setSelectedEmployee}
                additionalVacationDays={additionalVacationDays}
                setAdditionalVacationDays={setAdditionalVacationDays}
              />
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Employee Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <EmployeeInfoCard 
              selectedEmployeeData={selectedEmployeeData} 
              additionalVacationDays={additionalVacationDays} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Termination;
