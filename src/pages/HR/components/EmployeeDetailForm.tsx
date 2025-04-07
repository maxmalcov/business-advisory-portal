
import React, { useState } from 'react';
import { Employee, EmployeeStatus } from '../types/employee';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

interface EmployeeDetailFormProps {
  employee: Employee;
  onSave: (updatedEmployee: Employee) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const EmployeeDetailForm: React.FC<EmployeeDetailFormProps> = ({
  employee,
  onSave,
  onCancel,
  isSubmitting
}) => {
  const [formData, setFormData] = useState<Employee>({
    ...employee
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof Employee, string>>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: value 
    }));
    
    if (errors[name as keyof Employee]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleStartDateChange = (date: Date | undefined) => {
    if (!date) return;
    
    setFormData((prev) => ({ 
      ...prev, 
      startDate: format(date, 'yyyy-MM-dd')
    }));
    
    if (errors.startDate) {
      setErrors((prev) => ({ ...prev, startDate: undefined }));
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (!date) {
      setFormData((prev) => ({ 
        ...prev, 
        endDate: undefined
      }));
      return;
    }
    
    setFormData((prev) => ({ 
      ...prev, 
      endDate: format(date, 'yyyy-MM-dd')
    }));
  };

  const handleStatusChange = (value: EmployeeStatus) => {
    setFormData((prev) => ({ 
      ...prev, 
      status: value 
    }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Employee, string>> = {};
    
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.position) newErrors.position = 'Position is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    
    // If employee is terminated, end date is required
    if (formData.status === 'terminated' && !formData.endDate) {
      newErrors.endDate = 'End date is required for terminated employees';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Basic Information */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={errors.fullName ? "border-red-500" : ""}
            />
            {errors.fullName && (
              <p className="text-xs text-red-500">{errors.fullName}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="position">Position/Role</Label>
            <Input
              id="position"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              className={errors.position ? "border-red-500" : ""}
            />
            {errors.position && (
              <p className="text-xs text-red-500">{errors.position}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              name="companyName"
              value={formData.companyName || ''}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Status</Label>
            <RadioGroup 
              value={formData.status} 
              onValueChange={(value) => handleStatusChange(value as EmployeeStatus)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="active" id="active" />
                <Label htmlFor="active" className="cursor-pointer">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="terminated" id="terminated" />
                <Label htmlFor="terminated" className="cursor-pointer">Terminated</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* Identification */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500">Identification</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dniTie">DNI/TIE</Label>
            <Input
              id="dniTie"
              name="dniTie"
              value={formData.dniTie || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="idDocument">ID Document</Label>
            <div className="flex">
              <Input
                id="idDocument"
                name="idDocument"
                value={formData.idDocument || ''}
                onChange={handleInputChange}
                disabled
                className="flex-1"
              />
              <Button type="button" variant="outline" className="ml-2">
                Upload
              </Button>
            </div>
            <p className="text-xs text-gray-500">Document upload is not available in edit mode</p>
          </div>
        </div>
      </div>
      
      {/* Date Fields */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500">Employment Dates</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.startDate && "text-muted-foreground",
                    errors.startDate && "border-red-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.startDate ? format(new Date(formData.startDate), 'PPP') : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.startDate ? new Date(formData.startDate) : undefined}
                  onSelect={handleStartDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.startDate && (
              <p className="text-xs text-red-500">{errors.startDate}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.endDate && "text-muted-foreground",
                    errors.endDate && "border-red-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.endDate ? format(new Date(formData.endDate), 'PPP') : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.endDate ? new Date(formData.endDate) : undefined}
                  onSelect={handleEndDateChange}
                  initialFocus
                  disabled={(date) => {
                    if (!formData.startDate) return false;
                    return date < new Date(formData.startDate);
                  }}
                />
              </PopoverContent>
            </Popover>
            {errors.endDate && (
              <p className="text-xs text-red-500">{errors.endDate}</p>
            )}
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500">Schedule</h3>
        <div className="space-y-2">
          <Label htmlFor="weeklySchedule">Weekly Working Schedule</Label>
          <Textarea
            id="weeklySchedule"
            name="weeklySchedule"
            value={formData.weeklySchedule || ''}
            onChange={handleInputChange}
            placeholder="E.g., Monday-Friday: 9:00-17:00"
            rows={3}
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting}
        >
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default EmployeeDetailForm;
