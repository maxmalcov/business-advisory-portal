
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEmployeeData } from './hooks/useEmployeeData';
import TerminationForm from './components/TerminationForm';
import EmployeeInfoCard from './components/EmployeeInfoCard';
import { Separator } from '@/components/ui/separator';

const Termination: React.FC = () => {
  const { t } = useLanguage();
  const { employees, isLoading } = useEmployeeData();
  
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [additionalVacationDays, setAdditionalVacationDays] = useState<string>('0');
  
  const selectedEmployeeData = employees.find(emp => emp.id === selectedEmployee);
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">{t('hr.termination.title')}</h1>
        <p className="text-muted-foreground mt-2">
          Complete this form to process an employee termination request
        </p>
        <Separator className="mt-4" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-none shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Termination Details</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">Loading employee data...</p>
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
        
        <div className="space-y-6">
          <Card className="border-none shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Employee Information</CardTitle>
            </CardHeader>
            <CardContent>
              <EmployeeInfoCard 
                selectedEmployeeData={selectedEmployeeData} 
                additionalVacationDays={additionalVacationDays} 
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Termination;
