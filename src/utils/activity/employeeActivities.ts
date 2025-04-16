
import { supabase, employeesTable } from '@/integrations/supabase/client';
import { ActivityEvent } from './types';

export const fetchEmployeeActivities = async (
  isAdmin: boolean,
  companyName: string | null
): Promise<ActivityEvent[]> => {
  const activities: ActivityEvent[] = [];
  
  try {
    // Build the query based on user role
    let employeeQuery = employeesTable();
    
    if (!isAdmin) {
      if (companyName) {
        employeeQuery = employeeQuery.eq('company_name', companyName);
      } else {
        // If user has no company, they shouldn't see any employees
        employeeQuery = employeeQuery.eq('id', 'no-match');
      }
    }
    
    const { data: employees, error: employeesError } = await employeeQuery
      .select('id, full_name, status, start_date, end_date, created_at, company_name')
      .order('created_at', { ascending: false })
      .limit(10);

    if (employeesError) {
      console.error('Error fetching employees:', employeesError);
    } else if (employees) {
      // Process added employees
      employees.forEach(employee => {
        const createdDate = new Date(employee.created_at || '');
        
        // Employee added
        activities.push({
          id: `employee-added-${employee.id}`,
          type: 'employee-added',
          timestamp: createdDate,
          title: 'New employee added',
          description: `${employee.full_name} was added as a new employee${employee.company_name ? ' at ' + employee.company_name : ''}.`,
          metadata: { employeeId: employee.id }
        });
        
        // Employee terminated (if applicable)
        if (employee.status === 'terminated' && employee.end_date) {
          activities.push({
            id: `employee-terminated-${employee.id}`,
            type: 'employee-terminated',
            timestamp: new Date(employee.end_date),
            title: 'Employee terminated',
            description: `${employee.full_name}'s employment was terminated.`,
            metadata: { employeeId: employee.id }
          });
        }
      });
    }
    
    return activities;
  } catch (error) {
    console.error('Error fetching employee activities:', error);
    return [];
  }
};
