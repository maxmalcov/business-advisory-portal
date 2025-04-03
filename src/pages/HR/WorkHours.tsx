
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from '@/hooks/use-toast';

// Sample employee data
const employees = [
  { id: '1', name: 'John Doe', position: 'Software Developer' },
  { id: '2', name: 'Jane Smith', position: 'HR Manager' },
  { id: '3', name: 'Michael Johnson', position: 'Accountant' },
  { id: '4', name: 'Sarah Williams', position: 'Marketing Specialist' },
];

// Sample work hours data
const initialWorkHours = [
  { id: '1', employeeId: '1', employeeName: 'John Doe', date: '2025-04-01', hoursWorked: 8, overtime: 0, notes: 'Regular day' },
  { id: '2', employeeId: '2', date: '2025-04-01', employeeName: 'Jane Smith', hoursWorked: 7.5, overtime: 1, notes: 'Project meeting ran late' },
  { id: '3', employeeId: '1', date: '2025-04-02', employeeName: 'John Doe', hoursWorked: 8, overtime: 2, notes: 'Urgent fix required' },
];

// Form schema
const formSchema = z.object({
  employeeId: z.string({
    required_error: "Please select an employee",
  }),
  date: z.date({
    required_error: "Please select a date",
  }),
  hoursWorked: z.coerce.number()
    .min(0, "Hours must be 0 or more")
    .max(24, "Hours cannot exceed 24"),
  overtime: z.coerce.number()
    .min(0, "Overtime must be 0 or more")
    .max(12, "Overtime cannot exceed 12"),
  notes: z.string().optional(),
});

const WorkHours: React.FC = () => {
  const { t } = useLanguage();
  const [workHoursData, setWorkHoursData] = useState(initialWorkHours);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeId: "",
      date: new Date(),
      hoursWorked: 8,
      overtime: 0,
      notes: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const selectedEmployee = employees.find(emp => emp.id === values.employeeId);
    
    const newEntry = {
      id: (workHoursData.length + 1).toString(),
      employeeId: values.employeeId,
      employeeName: selectedEmployee?.name || "Unknown",
      date: format(values.date, 'yyyy-MM-dd'),
      hoursWorked: values.hoursWorked,
      overtime: values.overtime,
      notes: values.notes || "",
    };
    
    setWorkHoursData([...workHoursData, newEntry]);
    setIsAddingNew(false);
    form.reset();
    
    toast({
      title: "Hours recorded",
      description: `Work hours for ${selectedEmployee?.name} have been recorded successfully.`,
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
            <Button onClick={() => setIsAddingNew(!isAddingNew)}>
              {isAddingNew ? 'Cancel' : 'Add Work Hours'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAddingNew ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="employeeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select employee" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {employees.map((employee) => (
                              <SelectItem key={employee.id} value={employee.id}>
                                {employee.name} - {employee.position}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={`w-full pl-3 text-left font-normal ${
                                  !field.value && "text-muted-foreground"
                                }`}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                field.onChange(date);
                                setSelectedDate(date);
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hoursWorked"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hours Worked</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="overtime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Overtime Hours</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">Submit Work Hours</Button>
              </form>
            </Form>
          ) : (
            <div>
              <div className="mb-4">
                <Label htmlFor="filter-date">Filter by date</Label>
                <div className="flex gap-2 mt-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-[240px] justify-start">
                        {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedDate(undefined)}
                  >
                    Clear
                  </Button>
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Overtime</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workHoursData
                    .filter(entry => 
                      !selectedDate || entry.date === format(selectedDate, 'yyyy-MM-dd')
                    )
                    .map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{entry.employeeName}</TableCell>
                        <TableCell>{entry.date}</TableCell>
                        <TableCell>{entry.hoursWorked}</TableCell>
                        <TableCell>{entry.overtime}</TableCell>
                        <TableCell>{entry.hoursWorked + entry.overtime}</TableCell>
                        <TableCell>{entry.notes}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              
              {workHoursData
                .filter(entry => 
                  !selectedDate || entry.date === format(selectedDate, 'yyyy-MM-dd')
                ).length === 0 && (
                <p className="text-center py-4 text-muted-foreground">
                  No work hours found for the selected date.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkHours;
