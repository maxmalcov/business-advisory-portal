
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { Employee } from '../../types/employee';
import { useEmployeeDetail } from '../../hooks/useEmployeeDetail';
import EmployeeDetailDialogContent from './EmployeeDetailDialogContent';

interface EmployeeDetailDialogProps {
  employeeId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EmployeeDetailDialog: React.FC<EmployeeDetailDialogProps> = ({
  employeeId,
  open,
  onOpenChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const {
    employee,
    isLoading,
    isSubmitting,
    error,
    fetchEmployeeData,
    handleSave,
  } = useEmployeeDetail();
  
  useEffect(() => {
    if (open && employeeId) {
      fetchEmployeeData(employeeId);
    }
  }, [employeeId, open, fetchEmployeeData]);

  const handleSaveWrapper = (updatedEmployee: Employee) => {
    handleSave(updatedEmployee);
    setIsEditing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{isEditing ? 'Edit Employee' : 'Employee Details'}</span>
            {!isEditing && employee && !isLoading && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Edit employee information' : 'View employee details'}
          </DialogDescription>
        </DialogHeader>

        <EmployeeDetailDialogContent
          employee={employee}
          isLoading={isLoading}
          isSubmitting={isSubmitting}
          error={error}
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onSave={handleSaveWrapper}
          onCancel={() => setIsEditing(false)}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDetailDialog;
