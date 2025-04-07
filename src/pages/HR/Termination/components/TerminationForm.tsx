
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { employeesTable } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { EmployeeData } from '../types';

interface TerminationFormProps {
  employees: EmployeeData[];
  selectedEmployee: string;
  setSelectedEmployee: (value: string) => void;
  additionalVacationDays: string;
  setAdditionalVacationDays: (value: string) => void;
}

const reasonOptions = [
  { id: 'voluntary', name: 'Voluntary Resignation' },
  { id: 'performance', name: 'Performance Issues' },
  { id: 'redundancy', name: 'Redundancy' },
  { id: 'contract_end', name: 'End of Contract' },
  { id: 'other', name: 'Other' }
];

const TerminationForm = ({ 
  employees, 
  selectedEmployee, 
  setSelectedEmployee, 
  additionalVacationDays, 
  setAdditionalVacationDays 
}: TerminationFormProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [terminationDate, setTerminationDate] = useState<Date | undefined>(undefined);
  const [terminationReason, setTerminationReason] = useState<string>('');
  const [comments, setComments] = useState<string>('');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmployee) {
      toast({
        title: t('app.warning'),
        description: 'Please select an employee',
        variant: 'destructive'
      });
      return;
    }
    
    if (!terminationDate) {
      toast({
        title: t('app.warning'),
        description: 'Please select a termination date',
        variant: 'destructive'
      });
      return;
    }
    
    if (!terminationReason) {
      toast({
        title: t('app.warning'),
        description: 'Please select a termination reason',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      const { error } = await employeesTable()
        .update({
          status: 'terminated',
          end_date: terminationDate.toISOString().split('T')[0]
        })
        .eq('id', selectedEmployee);
        
      if (error) throw error;
      
      toast({
        title: t('app.success'),
        description: 'Termination process completed successfully',
      });
      
      navigate('/hr');
    } catch (error) {
      console.error('Error terminating employee:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete termination process',
        variant: 'destructive'
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="employee">{t('hr.termination.employee')}</Label>
          <Select 
            value={selectedEmployee}
            onValueChange={setSelectedEmployee}
          >
            <SelectTrigger id="employee">
              <SelectValue placeholder="Select an employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map(employee => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.name} - {employee.position}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="terminationDate">{t('hr.termination.date')}</Label>
          <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                id="terminationDate"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {terminationDate ? format(terminationDate, 'PPP') : <span>Select a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={terminationDate}
                onSelect={(date) => {
                  setTerminationDate(date);
                  setIsDatePickerOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="reason">{t('hr.termination.reason')}</Label>
          <Select 
            value={terminationReason}
            onValueChange={setTerminationReason}
          >
            <SelectTrigger id="reason">
              <SelectValue placeholder="Select a reason" />
            </SelectTrigger>
            <SelectContent>
              {reasonOptions.map(reason => (
                <SelectItem key={reason.id} value={reason.id}>
                  {reason.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="additionalVacationDays">Additional vacation days to compensate</Label>
          <Input 
            id="additionalVacationDays"
            type="number"
            min="0"
            value={additionalVacationDays}
            onChange={e => setAdditionalVacationDays(e.target.value)}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="comments">Additional comments</Label>
          <Textarea 
            id="comments"
            placeholder="Add any additional information here..."
            value={comments}
            onChange={e => setComments(e.target.value)}
          />
        </div>
      </div>
      
      <Button type="submit" className="w-full">Submit Termination Request</Button>
    </form>
  );
};

export default TerminationForm;
