
import { FormData } from '../types';
import { employeesTable } from '@/integrations/supabase/client';
import { uploadDocumentToStorage } from './DocumentUploader';

interface SubmitFormProps {
  formData: FormData;
  setIsSubmitting: (value: boolean) => void;
  setUploadProgress: (value: number) => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export const submitEmployeeForm = async ({
  formData,
  setIsSubmitting,
  setUploadProgress,
  onSuccess,
  onError
}: SubmitFormProps) => {
  try {
    console.log('Submitting employee data:', formData);
    
    let documentPath = '';
    if (formData.idDocument) {
      try {
        console.log('Uploading ID document:', formData.idDocument.name);
        documentPath = await uploadDocumentToStorage(formData.idDocument, setUploadProgress);
        console.log('Document uploaded successfully. Path:', documentPath);
      } catch (uploadError) {
        console.error('Document upload failed:', uploadError);
        onError('Could not upload the ID document. Please try again.');
        setIsSubmitting(false);
        return;
      }
    } else {
      console.warn('No ID document provided');
      onError('Please upload an ID document before submitting the form.');
      setIsSubmitting(false);
      return;
    }
    
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
      
    if (error) {
      console.error('Supabase insertion error:', error);
      throw error;
    }
    
    console.log('Employee added successfully:', data);
    onSuccess();
    
  } catch (error) {
    console.error('Error adding employee:', error);
    onError('There was a problem adding the employee. Please check console for details.');
  } finally {
    setIsSubmitting(false);
    setUploadProgress(0);
  }
};
