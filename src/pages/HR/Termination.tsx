import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { employeesTable, Employee } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const reasonOptions = [
  { id: 'voluntary', name: 'Voluntary Resignation' },
  { id: 'performance', name: 'Performance Issues' },
  { id: 'redundancy', name: 'Redundancy' },
  { id: 'contract_end', name: 'End of Contract' },
  { id: 'other', name: 'Other' }
];

interface EmployeeData {
  id: string;
  name: string;
  position: string;
  startDate: Date;
  vacationDaysTotal: number;
  vacationDaysUsed: number;
}

const Termination: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [terminationDate, setTerminationDate] = useState<Date | undefined>(undefined);
  const [additionalVacationDays, setAdditionalVacationDays] = useState<string>('0');
  const [terminationReason, setTerminationReason] = useState<string>('');
  const [comments, setComments] = useState<string>('');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { data, error } = await employeesTable()
          .select('id, full_name, position, start_date')
          .eq('status', 'active');
          
        if (error) throw error;
        
        if (data && Array.isArray(data)) {
          const transformedData: EmployeeData[] = data.map((emp: Employee) => ({
            id: emp.id,
            name: emp.full_name,
            position: emp.position,
            startDate: new Date(emp.start_date),
            vacationDaysTotal: 23,
            vacationDaysUsed: Math.floor(Math.random() * 20)
          }));
          
          setEmployees(transformedData);
        } else {
          setEmployees([]);
          console.warn('Unexpected data format received:', data);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
        toast({
          title: 'Error',
          description: 'Failed to load employee data',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEmployees();
  }, [toast]);
  
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
  
  const selectedEmployeeData = employees.find(emp => emp.id === selectedEmployee);
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">{t('hr.termination.title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t('hr.termination.title')}</CardTitle>
            <CardDescription>Fill out this form to process an employee termination</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Employee Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedEmployeeData ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Employee</h3>
                  <p className="font-medium">{selectedEmployeeData.name}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Position</h3>
                  <p>{selectedEmployeeData.position}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Start Date</h3>
                  <p>{format(selectedEmployeeData.startDate, 'PPP')}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Vacation Days</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Days</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Total</TableCell>
                        <TableCell>{selectedEmployeeData.vacationDaysTotal}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{t('hr.termination.vacation')}</TableCell>
                        <TableCell>{selectedEmployeeData.vacationDaysUsed}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Remaining</TableCell>
                        <TableCell>{selectedEmployeeData.vacationDaysTotal - selectedEmployeeData.vacationDaysUsed}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Additional</TableCell>
                        <TableCell>{Number(additionalVacationDays) || 0}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Select an employee to view their information</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Termination;
