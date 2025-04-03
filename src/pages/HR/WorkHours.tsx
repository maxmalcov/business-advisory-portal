
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from '@/hooks/use-toast';
import { Edit, Save, Plus, Trash2, Calendar as CalendarIcon } from 'lucide-react';

// Sample employee data
const initialEmployeeData = [
  { 
    id: '1', 
    companyName: 'Tech Solutions Inc', 
    employeeName: 'John Doe', 
    grossSalary: 5000, 
    notes: 'Regular hours',
    absenceDays: 0,
    medicalLeaveDate: null
  },
  { 
    id: '2', 
    companyName: 'Marketing Pro', 
    employeeName: 'Jane Smith', 
    grossSalary: 4500, 
    notes: 'Half day on Friday',
    absenceDays: 1,
    medicalLeaveDate: '2025-04-02'
  },
  { 
    id: '3', 
    companyName: 'Data Analytics Ltd', 
    employeeName: 'Michael Johnson', 
    grossSalary: 6000, 
    notes: 'Overtime approved',
    absenceDays: 0,
    medicalLeaveDate: null
  },
];

// Form schema for adding/editing records
const formSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  employeeName: z.string().min(1, "Employee name is required"),
  grossSalary: z.coerce.number().positive("Salary must be positive"),
  notes: z.string().optional(),
  absenceDays: z.coerce.number().min(0, "Absence days cannot be negative").optional(),
  medicalLeaveDate: z.date().nullable().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const WorkHours: React.FC = () => {
  const { t } = useLanguage();
  const [employeeData, setEmployeeData] = useState(initialEmployeeData);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [emailRecipient, setEmailRecipient] = useState('hr@pba.test');
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      employeeName: "",
      grossSalary: 0,
      notes: "",
      absenceDays: 0,
      medicalLeaveDate: null,
    },
  });

  // Handle form submission for new records
  const onSubmit = (values: FormValues) => {
    const newEntry = {
      id: (employeeData.length + 1).toString(),
      companyName: values.companyName,
      employeeName: values.employeeName,
      grossSalary: values.grossSalary,
      notes: values.notes || "",
      absenceDays: values.absenceDays || 0,
      medicalLeaveDate: values.medicalLeaveDate ? format(values.medicalLeaveDate, 'yyyy-MM-dd') : null,
    };
    
    setEmployeeData([...employeeData, newEntry]);
    setIsAddingNew(false);
    form.reset();
    
    toast({
      title: "Record added",
      description: `Work hours for ${values.employeeName} have been recorded.`,
    });
  };

  // Start editing a row
  const startEdit = (employee: any) => {
    setEditingId(employee.id);
    form.reset({
      companyName: employee.companyName,
      employeeName: employee.employeeName,
      grossSalary: employee.grossSalary,
      notes: employee.notes,
      absenceDays: employee.absenceDays,
      medicalLeaveDate: employee.medicalLeaveDate ? new Date(employee.medicalLeaveDate) : null,
    });
  };

  // Save edited row
  const saveEdit = () => {
    if (!editingId) return;
    
    const values = form.getValues();
    const updatedData = employeeData.map(emp => 
      emp.id === editingId 
        ? {
            ...emp,
            companyName: values.companyName,
            employeeName: values.employeeName,
            grossSalary: values.grossSalary,
            notes: values.notes || "",
            absenceDays: values.absenceDays || 0,
            medicalLeaveDate: values.medicalLeaveDate ? format(values.medicalLeaveDate, 'yyyy-MM-dd') : null,
          }
        : emp
    );
    
    setEmployeeData(updatedData);
    setEditingId(null);
    form.reset();
    
    toast({
      title: "Record updated",
      description: "Work hours record has been updated successfully.",
    });
  };

  // Delete a row
  const deleteRow = (id: string) => {
    setEmployeeData(employeeData.filter(emp => emp.id !== id));
    
    toast({
      title: "Record deleted",
      description: "Work hours record has been deleted.",
    });
  };

  // Submit data to HR email
  const submitToHR = () => {
    // In a real application, this would send data to a backend service
    // For now we'll just simulate the email being sent
    toast({
      title: "Data submitted",
      description: `Work hours data sent to ${emailRecipient}`,
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">{t('nav.hr.work_hours')}</h1>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{t('hr.work_hours.title')}</CardTitle>
              <CardDescription>{t('hr.work_hours.description')}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setIsAddingNew(!isAddingNew)}>
                {isAddingNew ? 'Cancel' : <><Plus size={16} /> Add Record</>}
              </Button>
              <Button onClick={submitToHR} variant="outline">
                Send to HR
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* HR Email Recipient Configuration */}
          <div className="mb-6">
            <Label htmlFor="hr-email">HR Email Recipient</Label>
            <div className="flex gap-2 mt-1">
              <Input 
                id="hr-email" 
                value={emailRecipient} 
                onChange={(e) => setEmailRecipient(e.target.value)}
                placeholder="Email address for HR submissions"
                className="max-w-md"
              />
            </div>
          </div>
          
          {/* Add/Edit Form */}
          {(isAddingNew || editingId) && (
            <div className="mb-6 p-4 border rounded-md shadow-sm">
              <h3 className="text-lg font-medium mb-4">
                {editingId ? 'Edit Record' : 'Add New Record'}
              </h3>
              <form onSubmit={form.handleSubmit(editingId ? saveEdit : onSubmit)} className="space-y-4">
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
                  <Button type="button" variant="outline" onClick={() => {
                    setIsAddingNew(false);
                    setEditingId(null);
                    form.reset();
                  }}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingId ? 'Save Changes' : 'Add Record'}
                  </Button>
                </div>
              </form>
            </div>
          )}
          
          {/* Employee Records Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Gross Salary</TableHead>
                <TableHead>Absence Days</TableHead>
                <TableHead>Medical Leave</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employeeData.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.companyName}</TableCell>
                  <TableCell>{employee.employeeName}</TableCell>
                  <TableCell>${employee.grossSalary}</TableCell>
                  <TableCell>{employee.absenceDays}</TableCell>
                  <TableCell>{employee.medicalLeaveDate || 'N/A'}</TableCell>
                  <TableCell>{employee.notes}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => startEdit(employee)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => deleteRow(employee.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {employeeData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    No work hours records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkHours;
