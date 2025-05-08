
import { FormData } from '../types';
import {employeesTable, notificationSettingsTable} from '@/integrations/supabase/client';
import { uploadDocumentToStorage } from './DocumentUploader';
import { supabase } from '@/integrations/supabase/client';
import {log} from "@/utils/logs/log.funciton.ts";
import {AppUser, useAuth} from "@/context/AuthContext.tsx";
import {sendEmail} from "@/integrations/email";

interface SubmitFormProps {
  formData: FormData;
  setIsSubmitting: (value: boolean) => void;
  setUploadProgress: (value: number) => void;
  onSuccess: () => void;
  onError: (message: string) => void;
  user: AppUser | null
}

export const submitEmployeeForm = async ({
  formData,
  setIsSubmitting,
  setUploadProgress,
  onSuccess,
  onError,
  user
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
      start_date: formData.startDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
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

    const { data: settingsData , error: settingsError } = await notificationSettingsTable()
        .select('email')
        .eq('category', 'hr_payroll')
        .maybeSingle();

    if(settingsError){
      throw new Error(`Get notification settings error: ${error}`)
    }

    log({ action: "New employee", description: `${user.name} added new employee`, user: user.email, level: 'info', category: "Employee"})
    sendEmail((settingsData as any).email, `New Employee Registered: ${formData.fullName}`, `
A new employee has been registered by a client.

👤 Full Name: ${formData.fullName}
🏢 Company Name: ${formData.companyName}
🆔 Employee DNI/TIE: ${formData.employeeDni}
📅 Start Date: ${formData.startDate}
🕒 Working Schedule: ${formData.schedule}
💼 Job Position: ${formData.position}
🔐 Social Security Number: ${formData.socialSecurityNumber}

💰 Monthly Salary: ${formData.salary} (${formData.salaryType})
🏦 IBAN: ${formData.iban}
📧 Employee Email: ${formData.employeeEmail}
🏠 Address: ${formData.address}
📝 Additional Comments: ${formData.comments || 'None'}
`)
    
    // Send notification to admin
    const notificationResult = await supabase.functions.invoke('notify-admin-new-employee', {
      body: JSON.stringify({
        ...formData,
        startDate: formData.startDate?.toISOString().split('T')[0],
        idDocument: documentPath
      })
    });

    if (notificationResult.error) {
      console.error('Admin notification failed:', notificationResult.error);
      // Non-critical error, so we continue with the success flow
    }
    
    onSuccess();
    
  } catch (error) {
    console.error('Error adding employee:', error);
    onError('There was a problem adding the employee. Please check console for details.');
  } finally {
    setIsSubmitting(false);
    setUploadProgress(0);
  }
};
