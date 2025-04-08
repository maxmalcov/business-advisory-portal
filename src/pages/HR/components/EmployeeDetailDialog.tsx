
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter, 
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Employee } from '../types/employee';
import { Pencil, Save, X } from 'lucide-react';
import EmployeeDetailForm from './EmployeeDetailForm';
import { useToast } from '@/hooks/use-toast';
import { employeesTable } from '@/integrations/supabase/client';
import { EmployeeDetailView } from './EmployeeDetail';

interface EmployeeDetailDialogProps {
  employee: Employee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EmployeeDetailDialog: React.FC<EmployeeDetailDialogProps> = ({
  employee,
  open,
  onOpenChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Add logging to track the employee prop received
  useEffect(() => {
    if (open && employee) {
      console.log('EmployeeDetailDialog received employee:', employee);
    }
  }, [open, employee]);

  const handleSave = async (updatedEmployee: Employee) => {
    if (!employee) return;
    
    setIsSubmitting(true);
    
    try {
      console.log('Saving employee update:', updatedEmployee);
      
      const { error } = await employeesTable()
        .update({
          full_name: updatedEmployee.fullName,
          position: updatedEmployee.position,
          status: updatedEmployee.status,
          start_date: updatedEmployee.startDate,
          end_date: updatedEmployee.endDate || null,
          company_name: updatedEmployee.companyName || null,
          dni_tie: updatedEmployee.dniTie || null,
          weekly_schedule: updatedEmployee.weeklySchedule || null
        })
        .eq('id', employee.id);
        
      if (error) throw error;
      
      toast({
        title: 'Employee Updated',
        description: 'Employee information has been successfully updated.',
      });
      
      setIsEditing(false);
      
      // Reload the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Error updating employee:', error);
      toast({
        title: 'Error',
        description: 'There was a problem updating the employee information.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Return early if no employee data
  if (!employee) {
    console.log('No employee data provided to dialog');
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{isEditing ? 'Edit Employee' : 'Employee Details'}</span>
            {!isEditing && (
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
            View or edit employee information
          </DialogDescription>
        </DialogHeader>

        {isEditing ? (
          <EmployeeDetailForm 
            employee={employee}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
            isSubmitting={isSubmitting}
          />
        ) : (
          <EmployeeDetailView employee={employee} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDetailDialog;
