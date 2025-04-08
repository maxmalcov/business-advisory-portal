
import React from 'react';
import { Button } from '@/components/ui/button';
import { Employee } from '../../types/employee';
import EmployeeDetailForm from '../EmployeeDetailForm';
import { EmployeeDetailView } from '../EmployeeDetail';
import EmployeeDetailSkeleton from '../EmployeeDetail/EmployeeDetailSkeleton';

interface EmployeeDetailDialogContentProps {
  employee: Employee | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (updatedEmployee: Employee) => void;
  onCancel: () => void;
  onClose: () => void;
}

const EmployeeDetailDialogContent: React.FC<EmployeeDetailDialogContentProps> = ({
  employee,
  isLoading,
  isSubmitting,
  error,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onClose
}) => {
  if (isLoading) {
    return <EmployeeDetailSkeleton />;
  }
  
  if (error) {
    return (
      <div className="py-8 text-center">
        <h3 className="text-lg font-medium text-red-500 mb-2">Error Loading Data</h3>
        <p className="text-gray-500">{error}</p>
        <Button 
          variant="outline" 
          onClick={onClose} 
          className="mt-4"
        >
          Close
        </Button>
      </div>
    );
  }
  
  if (!employee) {
    return (
      <div className="py-8 text-center">
        <h3 className="text-lg font-medium text-gray-500 mb-2">No Data Available</h3>
        <p className="text-gray-500">Employee information could not be loaded.</p>
        <Button 
          variant="outline" 
          onClick={onClose} 
          className="mt-4"
        >
          Close
        </Button>
      </div>
    );
  }

  if (isEditing) {
    return (
      <EmployeeDetailForm 
        employee={employee}
        onSave={onSave}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
      />
    );
  }
  
  return <EmployeeDetailView employee={employee} />;
};

export default EmployeeDetailDialogContent;
