
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Employee } from '../types/employee';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Pencil, Save, X, Eye } from 'lucide-react';
import EmployeeDetailForm from './EmployeeDetailForm';
import { useToast } from '@/hooks/use-toast';
import { employeesTable } from '@/integrations/supabase/client';

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

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '-';
    try {
      return format(new Date(dateStr), 'MMM d, yyyy');
    } catch {
      return dateStr;
    }
  };

  const handleSave = async (updatedEmployee: Employee) => {
    if (!employee) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await employeesTable()
        .update({
          full_name: updatedEmployee.fullName,
          position: updatedEmployee.position,
          status: updatedEmployee.status,
          start_date: updatedEmployee.startDate,
          end_date: updatedEmployee.endDate || null
        })
        .eq('id', employee.id);
        
      if (error) throw error;
      
      toast({
        title: 'Employee Updated',
        description: 'Employee information has been successfully updated.',
      });
      
      setIsEditing(false);
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

  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
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
        </DialogHeader>

        {isEditing ? (
          <EmployeeDetailForm 
            employee={employee}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
            isSubmitting={isSubmitting}
          />
        ) : (
          <div className="space-y-4">
            {/* Basic Information */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Full Name</p>
                  <p className="text-sm">{employee.fullName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Position/Role</p>
                  <p className="text-sm">{employee.position}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge className={employee.status === 'active' ? 'bg-green-500' : 'bg-red-500'}>
                    {employee.status === 'active' ? 'Active' : 'Terminated'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Employment Dates */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Employment Dates</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Start Date</p>
                  <p className="text-sm">{formatDate(employee.startDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">End Date</p>
                  <p className="text-sm">{employee.endDate ? formatDate(employee.endDate) : '-'}</p>
                </div>
              </div>
            </div>

            {/* Additional fields can be displayed here in the future */}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDetailDialog;
