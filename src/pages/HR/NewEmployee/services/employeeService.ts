
import { supabase } from '@/integrations/supabase/client';
import { employeesTable } from '@/integrations/supabase/client';
import { FormData } from '../types';

export const createEmployee = async (formData: FormData) => {
  // Create the employee record
  const employeeData = {
    full_name: formData.fullName,
    position: formData.position,
    status: 'active',
    start_date: formData.startDate?.toISOString().split('T')[0],
    company_name: formData.companyName || null,
    dni_tie: formData.employeeDni || null,
    weekly_schedule: formData.schedule || null,
    id_document: formData.idDocument ? formData.idDocument.name : null
    // Note: We'll update the id_document_url after uploading the file
  };
  
  console.log('Sending employee data to Supabase:', employeeData);
  
  const { data: employeeRecord, error } = await employeesTable()
    .insert(employeeData)
    .select();
    
  if (error) throw error;
  
  if (!employeeRecord || employeeRecord.length === 0) {
    throw new Error('Failed to create employee record');
  }
  
  return employeeRecord;
};

export const uploadEmployeeDocument = async (employeeId: string, file: File) => {
  const filename = `${Date.now()}-${file.name}`;
  const filePath = `${employeeId}/${filename}`;
  
  console.log('Uploading file to Supabase Storage:', filePath);
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('employee-id-documents')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    });
    
  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    throw uploadError;
  }
  
  console.log('File uploaded successfully:', uploadData);
  
  // Get public URL for the file
  const { data: urlData } = supabase.storage
    .from('employee-id-documents')
    .getPublicUrl(filePath);
    
  return urlData;
};

export const updateEmployeeWithFileUrl = async (employeeId: string, fileUrl: string) => {
  const { error: updateError } = await employeesTable()
    .update({ id_document_url: fileUrl })
    .eq('id', employeeId);
    
  if (updateError) {
    console.error('Error updating employee with file URL:', updateError);
    throw updateError;
  }
};
