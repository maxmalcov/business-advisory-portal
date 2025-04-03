
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

import {
  WorkHoursHeader,
  EmailRecipientInput,
  WorkHoursForm,
  WorkHoursTable,
  EmployeeRecord,
  FormValues
} from './components';

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

const WorkHours: React.FC = () => {
  const { t } = useLanguage();
  const [employeeData, setEmployeeData] = useState(initialEmployeeData);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [emailRecipient, setEmailRecipient] = useState('hr@pba.test');
  const [currentFormValues, setCurrentFormValues] = useState<FormValues | undefined>(undefined);
  
  // Handle form submission for new records
  const onSubmit = (values: FormValues) => {
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
      setEditingId(null);
      
      toast({
        title: "Record updated",
        description: "Work hours record has been updated successfully.",
      });
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
    }
    
    setIsAddingNew(false);
    setCurrentFormValues(undefined);
  };

  // Start editing a row
  const startEdit = (employee: EmployeeRecord) => {
    setEditingId(employee.id);
    setIsAddingNew(true);
    setCurrentFormValues({
      companyName: employee.companyName,
      employeeName: employee.employeeName,
      grossSalary: employee.grossSalary,
      notes: employee.notes,
      absenceDays: employee.absenceDays,
      medicalLeaveDate: employee.medicalLeaveDate ? new Date(employee.medicalLeaveDate) : null,
    });
  };

  // Delete a row
  const deleteRow = (id: string) => {
    setEmployeeData(employeeData.filter(emp => emp.id !== id));
    
    toast({
      title: "Record deleted",
      description: "Work hours record has been deleted.",
    });
  };

  // Cancel form
  const cancelForm = () => {
    setIsAddingNew(false);
    setEditingId(null);
    setCurrentFormValues(undefined);
  };

  // Submit data to HR email
  const submitToHR = () => {
    // In a real application, this would send data to a backend service
    // For now we'll just simulate the email being sent
    toast({
      title: "Data submitted",
      description: `Work hours data sent to ${emailRecipient}`,
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">{t('nav.hr.work_hours')}</h1>
      
      <Card>
        <CardHeader>
          <WorkHoursHeader 
            isAddingNew={isAddingNew} 
            setIsAddingNew={setIsAddingNew} 
            submitToHR={submitToHR}
          />
        </CardHeader>
        <CardContent>
          {/* HR Email Recipient Configuration */}
          <EmailRecipientInput 
            emailRecipient={emailRecipient}
            setEmailRecipient={setEmailRecipient}
          />
          
          {/* Add/Edit Form */}
          {(isAddingNew || editingId) && (
            <WorkHoursForm 
              onSubmit={onSubmit}
              editingId={editingId}
              initialValues={currentFormValues}
              onCancel={cancelForm}
            />
          )}
          
          {/* Employee Records Table */}
          <WorkHoursTable 
            employeeData={employeeData} 
            onEdit={startEdit} 
            onDelete={deleteRow}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkHours;
