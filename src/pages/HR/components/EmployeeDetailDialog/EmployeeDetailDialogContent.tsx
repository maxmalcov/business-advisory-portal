
import React from 'react';
import { Button } from '@/components/ui/button';
import { Employee } from '../../types/employee';
import EmployeeDetailForm from '../EmployeeDetailForm/EmployeeDetailForm';
import { EmployeeDetailView } from '../EmployeeDetail';
import EmployeeDetailSkeleton from '../EmployeeDetail/EmployeeDetailSkeleton';
import { AlertCircle } from 'lucide-react';

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
  console.log("EmployeeDetailDialogContent rendering with:", {
    employee,
    isLoading,
    error,
    isEditing
  });
  
  if (isLoading) {
    return <EmployeeDetailSkeleton />;
  }
  
  if (error) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center mb-4">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">Error Loading Data</h3>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button 
          variant="outline" 
          onClick={onClose} 
          className="mx-auto"
        >
          Close
        </Button>
      </div>
    );
  }
  
  if (!employee) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <AlertCircle className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No Data Available</h3>
        <p className="text-muted-foreground mb-6">Employee information could not be loaded.</p>
        <Button 
          variant="outline" 
          onClick={onClose} 
          className="mx-auto"
        >
          Close
        </Button>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="pb-4">
        <EmployeeDetailForm 
          employee={employee}
          onSave={onSave}
          onCancel={onCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    );
  }
  
  return (
    <div className="pb-4">
      <EmployeeDetailView employee={employee} />
    </div>
  );
};

export default EmployeeDetailDialogContent;
