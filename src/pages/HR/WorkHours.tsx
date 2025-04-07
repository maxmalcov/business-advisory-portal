
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import {
  WorkHoursHeader,
  EmailRecipientInput,
  WorkHoursForm,
  WorkHoursTable,
} from './components';

import FilterInput from './components/FilterInput';
import { useEmployeeData } from './hooks/useEmployeeData';
import { useFormState } from './hooks/useFormState';
import { useEmailRecipient } from './hooks/useEmailRecipient';

const WorkHours: React.FC = () => {
  const { t } = useLanguage();
  const { 
    filteredData, 
    filterValue, 
    setFilterValue, 
    handleSubmit, 
    deleteRow 
  } = useEmployeeData();
  
  const {
    isAddingNew,
    setIsAddingNew,
    editingId,
    currentFormValues,
    startEdit,
    cancelForm
  } = useFormState();
  
  const {
    emailRecipient,
    setEmailRecipient,
    isValidEmail,
    submitToHR
  } = useEmailRecipient();
  
  // Handle form submission
  const onSubmit = (values: any) => {
    const success = handleSubmit(values, editingId);
    if (success) {
      cancelForm();
    }
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
            employeeData={filteredData}
          />
        </CardHeader>
        <CardContent>
          {/* HR Email Recipient Configuration */}
          <EmailRecipientInput 
            emailRecipient={emailRecipient}
            setEmailRecipient={setEmailRecipient}
            isValidEmail={isValidEmail}
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
          
          {/* Search and filter */}
          <div className="my-4">
            <FilterInput 
              value={filterValue}
              onChange={setFilterValue}
              placeholder="Filter by company or employee name..."
            />
          </div>
          
          {/* Employee Records Table */}
          <WorkHoursTable 
            employeeData={filteredData} 
            onEdit={startEdit} 
            onDelete={deleteRow}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkHours;
