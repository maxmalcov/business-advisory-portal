
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Pencil, X } from 'lucide-react';
import { Employee } from '../../types/employee';
import { useEmployeeDetail } from '../../hooks/useEmployeeDetail';
import EmployeeDetailDialogContent from './EmployeeDetailDialogContent';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
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
      console.log("Dialog opened with employeeId:", employeeId);
      fetchEmployeeData(employeeId);
    }
    
    // Reset editing state when dialog opens/closes
    if (!open) {
      setIsEditing(false);
    }
  }, [employeeId, open, fetchEmployeeData]);

  // Add debugging logs
  useEffect(() => {
    console.log("Employee data in dialog:", employee);
    console.log("Loading state:", isLoading);
    console.log("Error state:", error);
  }, [employee, isLoading, error]);

  const handleSaveWrapper = (updatedEmployee: Employee) => {
    console.log("Saving employee:", updatedEmployee);
    handleSave(updatedEmployee);
    setIsEditing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`p-0 overflow-hidden ${isMobile ? 'w-[95vw] max-w-none' : 'sm:max-w-[650px] md:max-w-[700px]'} max-h-[90vh]`}>
        <div className="flex flex-col h-full">
          <DialogHeader className="px-6 py-4 border-b bg-gray-50 sticky top-0 z-10 flex flex-row items-center justify-between">
            <DialogTitle className="text-xl font-bold">
              {isEditing ? 'Edit Employee' : 'Employee Details'}
            </DialogTitle>
            <div className="flex items-center gap-2">
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="rounded-full h-8 w-8 p-0"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <ScrollArea className="flex-1 p-6" style={{ maxHeight: 'calc(90vh - 70px)' }}>
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
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDetailDialog;
