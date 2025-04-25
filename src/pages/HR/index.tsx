import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, UserMinus, Clock } from 'lucide-react';
import EmployeeStatusToggle from './components/EmployeeStatusToggle';
import EmployeeList from './components/EmployeeList';
import { FilterInput } from './components/FilterInput';
import { useEmployeeList } from './hooks/useEmployeeList';
import { useIsSmallScreen } from '@/hooks/use-mobile';

const HR: React.FC = () => {
  const { t } = useLanguage();
  const { employees, statusFilter, setStatusFilter, isLoading, refreshEmployees } = useEmployeeList();
  const [filterText, setFilterText] = useState('');
  const isSmallScreen = useIsSmallScreen();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center space-x-4 pb-4 border-b">
        <div className="bg-primary/10 p-3 rounded-full">
          <Users className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">HR & Payroll</h1>
          <p className="text-muted-foreground mt-1">
            Manage employees, work hours, and terminations
          </p>
        </div>
      </div>
      
      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="card-hover flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <UserPlus className="mr-2 h-5 w-5" />
              {t('nav.hr.new_employee')}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground">
              Start the onboarding process for new employees
            </p>
          </CardContent>
          <CardFooter className="pt-2 mt-auto">
            <Link to="/hr/new-employee" className="w-full">
              <Button variant="outline" className="w-full">
                Go to New Employee
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card className="card-hover flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <UserMinus className="mr-2 h-5 w-5" />
              {t('nav.hr.termination')}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground">
              Manage employee termination processes
            </p>
          </CardContent>
          <CardFooter className="pt-2 mt-auto">
            <Link to="/hr/termination" className="w-full">
              <Button variant="outline" className="w-full">
                Go to Termination
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card className="card-hover flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Clock className="mr-2 h-5 w-5" />
              {t('nav.hr.work_hours')}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground">
              Track and manage employee working hours
            </p>
          </CardContent>
          <CardFooter className="pt-2 mt-auto">
            <Link to="/hr/work-hours" className="w-full">
              <Button variant="outline" className="w-full">
                Go to Work Hours
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      
      {/* Employee List Section */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">
          {t('hr.employee_list') || 'Employee List'}
        </h2>
        
        {isSmallScreen ? (
          <div className="space-y-4">
            <FilterInput 
              value={filterText} 
              onChange={setFilterText} 
              placeholder="Search by name, position, or company..."
              className="w-full"
            />
            
            <div className="mt-6">
              <EmployeeStatusToggle 
                value={statusFilter} 
                onChange={setStatusFilter} 
              />
            </div>
          </div>
        ) : (
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
        )}
        
        <div className={isSmallScreen ? "mt-6" : ""}>
          <EmployeeList 
            employees={employees} 
            isLoading={isLoading} 
            filterText={filterText}
          />
        </div>
      </div>
    </div>
  );
};

export default HR;
