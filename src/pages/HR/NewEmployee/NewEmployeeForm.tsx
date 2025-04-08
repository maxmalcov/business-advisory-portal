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
import { employeesTable, supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const NewEmployeeForm: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    fullName: '',
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
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      const isValidType = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
      if (!isValidType) {
        setErrors((prev) => ({ 
          ...prev, 
          idDocument: 'Only PDF, JPG and PNG files are accepted' 
        }));
        return;
      }
      
      if (file.size > 25 * 1024 * 1024) {
        setErrors((prev) => ({ 
          ...prev, 
          idDocument: 'File size must be less than 25MB' 
        }));
        return;
      }
      
      setFormData((prev) => ({ ...prev, idDocument: file }));
      
      if (errors.idDocument) {
        setErrors((prev) => ({ ...prev, idDocument: undefined }));
      }
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, startDate: date }));
    
    if (errors.startDate) {
      setErrors((prev) => ({ ...prev, startDate: undefined }));
    }
  };

  const handleSalaryTypeChange = (type: 'gross' | 'net') => {
    setFormData((prev) => ({ ...prev, salaryType: type }));
  };

  const uploadDocumentToStorage = async (file: File): Promise<string> => {
    try {
      // Create a unique file path with timestamp
      const timestamp = new Date().getTime();
      const fileExt = file.name.split('.').pop();
      const filePath = `${timestamp}_${file.name}`;
      
      // Upload the file to the 'employee_documents' bucket
      const { data, error } = await supabase.storage
        .from('employee_documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      // Track upload progress manually since onUploadProgress is not supported
      // This is just for UI feedback
      setUploadProgress(50); // Set to 50% immediately
      
      // Add a small delay to simulate progress
      await new Promise(resolve => setTimeout(resolve, 500));
      setUploadProgress(100); // Set to 100% after delay
      
      if (error) {
        throw error;
      }
      
      // Return the file path
      return filePath;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw new Error('Failed to upload document');
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.companyName) newErrors.companyName = 'Company name is required';
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.employeeDni) newErrors.employeeDni = 'Employee DNI/TIE is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.schedule) newErrors.schedule = 'Schedule is required';
    if (!formData.position) newErrors.position = 'Position is required';
    if (!formData.socialSecurityNumber) newErrors.socialSecurityNumber = 'Social Security number is required';
    if (!formData.idDocument) newErrors.idDocument = 'ID document is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      console.log('Submitting employee data:', formData);
      
      // Upload the ID document to Supabase Storage
      let documentPath = '';
      if (formData.idDocument) {
        try {
          documentPath = await uploadDocumentToStorage(formData.idDocument);
          console.log('Document uploaded successfully:', documentPath);
        } catch (uploadError) {
          console.error('Document upload failed:', uploadError);
          toast({
            title: 'Document Upload Failed',
            description: 'Could not upload the ID document. Please try again.',
            variant: 'destructive'
          });
          setIsSubmitting(false);
          return;
        }
      }
      
      // Updated to include all relevant fields from the form
      const employeeData = {
        full_name: formData.fullName,
        position: formData.position,
        status: 'active',
        start_date: formData.startDate?.toISOString().split('T')[0],
        company_name: formData.companyName || null,
        dni_tie: formData.employeeDni || null,
        weekly_schedule: formData.schedule || null,
        social_security_number: formData.socialSecurityNumber || null,
        salary: formData.salary || null,
        salary_type: formData.salaryType || null,
        iban: formData.iban || null,
        email: formData.employeeEmail || null,
        address: formData.address || null,
        comments: formData.comments || null,
        id_document: documentPath || null
      };
      
      console.log('Sending employee data to Supabase:', employeeData);
      
      const { data, error } = await employeesTable()
        .insert(employeeData)
        .select();
        
      if (error) throw error;
      
      console.log('Employee added successfully:', data);
      
      toast({
        title: 'Employee Added',
        description: 'New employee has been successfully added.',
      });
      
      navigate('/hr');
    } catch (error) {
      console.error('Error adding employee:', error);
      toast({
        title: 'Error',
        description: 'There was a problem adding the employee.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
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
            uploadProgress={uploadProgress}
          />
          
          <OptionalFields 
            formData={formData}
            handleInputChange={handleInputChange}
            handleSalaryTypeChange={handleSalaryTypeChange}
          />
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/hr')}
          >
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
