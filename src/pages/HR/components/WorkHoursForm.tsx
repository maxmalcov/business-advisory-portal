
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export interface FormValues {
  id?: string;
  employeeId?: string;
  employeeName: string;
  companyName?: string;
  grossSalary: number;
  absenceDays?: number;
  medicalLeaveDate?: Date | string | null;
  notes?: string;
}

interface WorkHoursFormProps {
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
  initialValues?: FormValues;
  editingId?: string;
}

const WorkHoursForm: React.FC<WorkHoursFormProps> = ({
  onSubmit,
  onCancel,
  initialValues,
  editingId,
}) => {
  // Initialize form with default values or provided initial values
  const form = useForm<FormValues>({
    defaultValues: {
      id: editingId,
      employeeId: initialValues?.employeeId || undefined,
      employeeName: initialValues?.employeeName || '',
      companyName: initialValues?.companyName || '',
      grossSalary: initialValues?.grossSalary || 0,
      absenceDays: initialValues?.absenceDays || 0,
      medicalLeaveDate: initialValues?.medicalLeaveDate || null,
      notes: initialValues?.notes || '',
    },
  });

  // Convert form values and submit
  const handleSubmit = (data: FormValues) => {
    onSubmit({
      ...data,
      id: editingId,
      // Ensure numbers are proper numbers
      grossSalary: Number(data.grossSalary),
      absenceDays: data.absenceDays ? Number(data.absenceDays) : 0,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Employee Name */}
          <FormField
            control={form.control}
            name="employeeName"
            rules={{ required: 'Employee name is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee Name*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter employee name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Company Name */}
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Gross Salary */}
          <FormField
            control={form.control}
            name="grossSalary"
            rules={{ required: 'Gross salary is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gross Salary*</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    min="0" 
                    step="0.01" 
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Absence Days */}
          <FormField
            control={form.control}
            name="absenceDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Absence Days</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    min="0" 
                    {...field}
                    onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Medical Leave Date */}
          <FormField
            control={form.control}
            name="medicalLeaveDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Medical Leave Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Notes */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Add any additional notes here..." 
                    className="resize-none h-20"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {editingId ? 'Update' : 'Add'} Employee
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default WorkHoursForm;
