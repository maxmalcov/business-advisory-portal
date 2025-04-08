
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
import { Employee } from '../types/employee';
import { useToast } from '@/hooks/use-toast';
import { employeesTable } from '@/integrations/supabase/client';
import EmployeeDetailForm from './EmployeeDetailForm';
import { EmployeeDetailView } from './EmployeeDetail';
import EmployeeDetailSkeleton from './EmployeeDetail/EmployeeDetailSkeleton';

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
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Fetch employee data when the dialog opens
  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!open || !employeeId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Fetching employee data for ID:', employeeId);
        
        const { data, error } = await employeesTable()
          .select('id, full_name, position, status, start_date, end_date, company_name, dni_tie, id_document, weekly_schedule')
          .eq('id', employeeId)
          .single();
          
        if (error) throw error;
        
        if (!data) {
          throw new Error('Employee not found');
        }
        
        // Transform the data to match our Employee interface
        const employeeData: Employee = {
          id: data.id as string,
          fullName: data.full_name as string,
          position: data.position as string,
          status: data.status as 'active' | 'terminated',
          startDate: data.start_date as string,
          endDate: data.end_date as string | undefined,
          companyName: data.company_name as string || '',
          dniTie: data.dni_tie as string || '',
          idDocument: data.id_document as string || '',
          weeklySchedule: data.weekly_schedule as string || ''
        };
        
        console.log('Employee data fetched successfully:', employeeData);
        setEmployee(employeeData);
      } catch (error) {
        console.error('Error fetching employee details:', error);
        setError('Failed to load employee information. Please try again.');
        toast({
          title: 'Error Loading Data',
          description: 'There was a problem loading the employee information.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEmployeeData();
  }, [employeeId, open, toast]);

  const handleSave = async (updatedEmployee: Employee) => {
    if (!employee) return;
    
    setIsSubmitting(true);
    setError(null);
    
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
      
      // Update the local employee state with the new data
      setEmployee(updatedEmployee);
      setIsEditing(false);
      
      // Reload the page to show updated data in the employee list
      window.location.reload();
    } catch (error) {
      console.error('Error updating employee:', error);
      setError('Failed to update employee information. Please try again.');
      toast({
        title: 'Error',
        description: 'There was a problem updating the employee information.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
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
            onClick={() => onOpenChange(false)} 
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
            onClick={() => onOpenChange(false)} 
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
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
          isSubmitting={isSubmitting}
        />
      );
    }
    
    return <EmployeeDetailView employee={employee} />;
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

        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDetailDialog;
