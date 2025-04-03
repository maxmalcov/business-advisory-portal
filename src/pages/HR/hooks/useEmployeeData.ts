
import { useState, useMemo } from 'react';
import { EmployeeRecord } from '../components/WorkHoursTable';
import { format } from 'date-fns';
import { FormValues } from '../components/WorkHoursForm';
import { toast } from '@/hooks/use-toast';

// Sample employee data
const initialEmployeeData: EmployeeRecord[] = [
  { 
    id: '1', 
    companyName: 'Tech Solutions Inc', 
    employeeName: 'John Doe', 
    grossSalary: 5000, 
    notes: 'Regular hours',
    absenceDays: 0,
    medicalLeaveDate: null
  },
  { 
    id: '2', 
    companyName: 'Marketing Pro', 
    employeeName: 'Jane Smith', 
    grossSalary: 4500, 
    notes: 'Half day on Friday',
    absenceDays: 1,
    medicalLeaveDate: '2025-04-02'
  },
  { 
    id: '3', 
    companyName: 'Data Analytics Ltd', 
    employeeName: 'Michael Johnson', 
    grossSalary: 6000, 
    notes: 'Overtime approved',
    absenceDays: 0,
    medicalLeaveDate: null
  },
];

export function useEmployeeData() {
  const [employeeData, setEmployeeData] = useState(initialEmployeeData);
  const [filterValue, setFilterValue] = useState('');
  
  // Filter the data based on search term
  const filteredData = useMemo(() => {
    if (!filterValue.trim()) return employeeData;
    
    const searchTerm = filterValue.toLowerCase();
    return employeeData.filter(
      employee => 
        employee.companyName.toLowerCase().includes(searchTerm) || 
        employee.employeeName.toLowerCase().includes(searchTerm)
    );
  }, [employeeData, filterValue]);
  
  // Handle form submission for new records
  const handleSubmit = (values: FormValues, editingId: string | null) => {
    if (editingId) {
      // Update existing record
      const updatedData = employeeData.map(emp => 
        emp.id === editingId 
          ? {
              ...emp,
              companyName: values.companyName,
              employeeName: values.employeeName,
              grossSalary: values.grossSalary,
              notes: values.notes || "",
              absenceDays: values.absenceDays || 0,
              medicalLeaveDate: values.medicalLeaveDate ? format(values.medicalLeaveDate, 'yyyy-MM-dd') : null,
            }
          : emp
      );
      
      setEmployeeData(updatedData);
      
      toast({
        title: "Record updated",
        description: "Work hours record has been updated successfully.",
      });

      return true;
    } else {
      // Add new record
      const newEntry = {
        id: (employeeData.length + 1).toString(),
        companyName: values.companyName,
        employeeName: values.employeeName,
        grossSalary: values.grossSalary,
        notes: values.notes || "",
        absenceDays: values.absenceDays || 0,
        medicalLeaveDate: values.medicalLeaveDate ? format(values.medicalLeaveDate, 'yyyy-MM-dd') : null,
      };
      
      setEmployeeData([...employeeData, newEntry]);
      
      toast({
        title: "Record added",
        description: `Work hours for ${values.employeeName} have been recorded.`,
      });

      return true;
    }
  };

  // Delete a row
  const deleteRow = (id: string) => {
    setEmployeeData(employeeData.filter(emp => emp.id !== id));
    
    toast({
      title: "Record deleted",
      description: "Work hours record has been deleted.",
    });
  };

  return {
    employeeData,
    filteredData,
    filterValue,
    setFilterValue,
    handleSubmit,
    deleteRow
  };
}
