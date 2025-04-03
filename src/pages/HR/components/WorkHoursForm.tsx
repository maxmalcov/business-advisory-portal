
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';

// Form schema for adding/editing records
const formSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  employeeName: z.string().min(1, "Employee name is required"),
  grossSalary: z.coerce.number().positive("Salary must be positive"),
  notes: z.string().optional(),
  absenceDays: z.coerce.number().min(0, "Absence days cannot be negative").optional(),
  medicalLeaveDate: z.date().nullable().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

interface WorkHoursFormProps {
  onSubmit: (values: FormValues) => void;
  editingId: string | null;
  initialValues?: FormValues;
  onCancel: () => void;
}

const WorkHoursForm: React.FC<WorkHoursFormProps> = ({
  onSubmit,
  editingId,
  initialValues,
  onCancel
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      companyName: "",
      employeeName: "",
      grossSalary: 0,
      notes: "",
      absenceDays: 0,
      medicalLeaveDate: null,
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <div className="mb-6 p-4 border rounded-md shadow-sm">
      <h3 className="text-lg font-medium mb-4">
        {editingId ? 'Edit Record' : 'Add New Record'}
      </h3>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="companyName">Company Name</Label>
            <Input 
              id="companyName"
              {...form.register("companyName")}
            />
            {form.formState.errors.companyName && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.companyName.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="employeeName">Employee Name</Label>
            <Input 
              id="employeeName"
              {...form.register("employeeName")}
            />
            {form.formState.errors.employeeName && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.employeeName.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="grossSalary">Gross Salary/Month</Label>
            <Input 
              id="grossSalary"
              type="number"
              {...form.register("grossSalary", {valueAsNumber: true})}
            />
            {form.formState.errors.grossSalary && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.grossSalary.message}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="absenceDays">Absence Days (Optional)</Label>
            <Input 
              id="absenceDays"
              type="number"
              {...form.register("absenceDays", {valueAsNumber: true})}
            />
            {form.formState.errors.absenceDays && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.absenceDays.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="medicalLeaveDate">Medical Leave Date (Optional)</Label>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.watch("medicalLeaveDate") ? format(form.watch("medicalLeaveDate"), "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={form.watch("medicalLeaveDate")}
                    onSelect={(date) => form.setValue("medicalLeaveDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Input 
            id="notes"
            {...form.register("notes")}
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {editingId ? 'Save Changes' : 'Add Record'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WorkHoursForm;
