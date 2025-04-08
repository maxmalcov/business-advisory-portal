
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserMinus, Clock } from 'lucide-react';
import EmployeeStatusToggle from './components/EmployeeStatusToggle';
import EmployeeList from './components/EmployeeList';
import { FilterInput } from './components/FilterInput';
import { useEmployeeList } from './hooks/useEmployeeList';

const HR: React.FC = () => {
  const { t } = useLanguage();
  const { employees, statusFilter, setStatusFilter, isLoading, refreshEmployees } = useEmployeeList();
  const [filterText, setFilterText] = useState('');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">{t('nav.hr')}</h1>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="card-hover">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Users className="mr-2 h-5 w-5" />
              {t('nav.hr.new_employee')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Start the onboarding process for new employees
            </p>
            <Link to="/hr/new-employee">
              <Button variant="outline" className="w-full">
                Go to New Employee
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <UserMinus className="mr-2 h-5 w-5" />
              {t('nav.hr.termination')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage employee termination processes
            </p>
            <Link to="/hr/termination">
              <Button variant="outline" className="w-full">
                Go to Termination
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Clock className="mr-2 h-5 w-5" />
              {t('nav.hr.work_hours')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Track and manage employee working hours
            </p>
            <Link to="/hr/work-hours">
              <Button variant="outline" className="w-full">
                Go to Work Hours
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Employee List</h2>
        
        <div className="flex justify-between items-center mb-3">
          <FilterInput 
            value={filterText} 
            onChange={setFilterText} 
            placeholder="Search by name, position, or company..."
          />
          <EmployeeStatusToggle 
            value={statusFilter} 
            onChange={setStatusFilter} 
          />
        </div>
        
        <EmployeeList 
          employees={employees} 
          isLoading={isLoading} 
          filterText={filterText}
        />
      </div>
    </div>
  );
};

export default HR;
