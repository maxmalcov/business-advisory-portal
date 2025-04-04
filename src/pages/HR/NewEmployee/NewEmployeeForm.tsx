
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormData, FormErrors } from './types';
import RequiredFields from './FormSections/RequiredFields';
import OptionalFields from './FormSections/OptionalFields';

const NewEmployeeForm: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    employeeDni: '',
    startDate: undefined,
    schedule: '',
    position: '',
    socialSecurityNumber: '',
    salary: '',
    salaryType: 'gross',
    iban: '',
    address: '',
    employeeEmail: '',
    comments: '',
    idDocument: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Check file type
      const isValidType = ['application/pdf', 'image/jpeg', 'image/jpg'].includes(file.type);
      if (!isValidType) {
        setErrors((prev) => ({ 
          ...prev, 
          idDocument: 'Only PDF and JPG files are accepted' 
        }));
        return;
      }
      
      // Check file size (max 25MB)
      if (file.size > 25 * 1024 * 1024) {
        setErrors((prev) => ({ 
          ...prev, 
          idDocument: 'File size must be less than 25MB' 
        }));
        return;
      }
      
      setFormData((prev) => ({ ...prev, idDocument: file }));
      
      // Clear error
      if (errors.idDocument) {
        setErrors((prev) => ({ ...prev, idDocument: undefined }));
      }
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, startDate: date }));
    
    // Clear error
    if (errors.startDate) {
      setErrors((prev) => ({ ...prev, startDate: undefined }));
    }
  };

  const handleSalaryTypeChange = (type: 'gross' | 'net') => {
    setFormData((prev) => ({ ...prev, salaryType: type }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Required fields
    if (!formData.companyName) newErrors.companyName = 'Company name is required';
    if (!formData.employeeDni) newErrors.employeeDni = 'Employee DNI/TIE is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.schedule) newErrors.schedule = 'Schedule is required';
    if (!formData.position) newErrors.position = 'Position is required';
    if (!formData.socialSecurityNumber) newErrors.socialSecurityNumber = 'Social Security number is required';
    if (!formData.idDocument) newErrors.idDocument = 'ID document is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    // Simulate form submission - normally this would be an API call
    setTimeout(() => {
      toast({
        title: 'Form Submitted',
        description: 'New employee information has been sent successfully.',
      });
      
      // Reset form
      setFormData({
        companyName: '',
        employeeDni: '',
        startDate: undefined,
        schedule: '',
        position: '',
        socialSecurityNumber: '',
        salary: '',
        salaryType: 'gross',
        iban: '',
        address: '',
        employeeEmail: '',
        comments: '',
        idDocument: null,
      });
      
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <>
      <CardHeader>
        <CardTitle>{t('hr.new_employee.title')}</CardTitle>
        <CardDescription>Fill in the form below to register a new employee</CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <RequiredFields 
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            handleDateChange={handleDateChange}
            handleFileChange={handleFileChange}
          />
          
          <OptionalFields 
            formData={formData}
            handleInputChange={handleInputChange}
            handleSalaryTypeChange={handleSalaryTypeChange}
          />
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline">
            {t('app.cancel')}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('app.loading') : t('app.submit')}
          </Button>
        </CardFooter>
      </form>
    </>
  );
};

export default NewEmployeeForm;
