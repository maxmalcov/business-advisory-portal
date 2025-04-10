
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, UserMinus, Clock } from 'lucide-react';
import EmployeeList from './components/EmployeeList';
import { FilterInput } from './components/FilterInput';
import { TableFilters, FilterOptions } from './components/TableFilters';
import { useEmployeeList } from './hooks/useEmployeeList';
import { useIsSmallScreen } from '@/hooks/use-mobile';
import { Employee, EmployeeStatus } from './types/employee';

const HR: React.FC = () => {
  const { t } = useLanguage();
  const { employees, isLoading, refreshEmployees } = useEmployeeList();
  const isSmallScreen = useIsSmallScreen();
  
  // Initialize filter options
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    textSearch: '',
    position: '',
    status: 'all',
    startDateFrom: null,
    startDateTo: null,
    endDateFrom: null,
    endDateTo: null,
  });
  
  // Extract unique positions for the position filter
  const positions = useMemo(() => {
    return Array.from(new Set(employees.map(emp => emp.position).filter(pos => pos && pos.trim() !== '')));
  }, [employees]);
  
  // Filter employees based on all filter criteria
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      // Text search filter
      if (filterOptions.textSearch) {
        const searchText = filterOptions.textSearch.toLowerCase();
        const nameMatch = employee.fullName.toLowerCase().includes(searchText);
        const positionMatch = employee.position.toLowerCase().includes(searchText);
        const companyMatch = employee.companyName?.toLowerCase().includes(searchText) || false;
        
        if (!nameMatch && !positionMatch && !companyMatch) {
          return false;
        }
      }
      
      // Position filter
      if (filterOptions.position && employee.position !== filterOptions.position) {
        return false;
      }
      
      // Status filter
      if (filterOptions.status !== 'all' && employee.status !== filterOptions.status) {
        return false;
      }
      
      // Start date range filter
      if (filterOptions.startDateFrom || filterOptions.startDateTo) {
        const startDate = new Date(employee.startDate);
        
        if (filterOptions.startDateFrom && startDate < filterOptions.startDateFrom) {
          return false;
        }
        
        if (filterOptions.startDateTo) {
          // Add one day to make the "to" date inclusive
          const toDateInclusive = new Date(filterOptions.startDateTo);
          toDateInclusive.setDate(toDateInclusive.getDate() + 1);
          
          if (startDate > toDateInclusive) {
            return false;
          }
        }
      }
      
      // End date range filter
      if (filterOptions.endDateFrom || filterOptions.endDateTo) {
        // Skip if employee has not been terminated
        if (!employee.endDate) {
          if (filterOptions.endDateFrom || filterOptions.endDateTo) {
            return false;
          }
        } else {
          const endDate = new Date(employee.endDate);
          
          if (filterOptions.endDateFrom && endDate < filterOptions.endDateFrom) {
            return false;
          }
          
          if (filterOptions.endDateTo) {
            // Add one day to make the "to" date inclusive
            const toDateInclusive = new Date(filterOptions.endDateTo);
            toDateInclusive.setDate(toDateInclusive.getDate() + 1);
            
            if (endDate > toDateInclusive) {
              return false;
            }
          }
        }
      }
      
      return true;
    });
  }, [employees, filterOptions]);
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">{t('nav.hr')}</h1>
      
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
      
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Employee List</h2>
        
        {/* Advanced filters */}
        <div className="mb-6">
          <TableFilters
            filterOptions={filterOptions}
            onFilterChange={setFilterOptions}
            positions={positions}
          />
        </div>
        
        <div>
          <EmployeeList 
            employees={filteredEmployees} 
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default HR;
