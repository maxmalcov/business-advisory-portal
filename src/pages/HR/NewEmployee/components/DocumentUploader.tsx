import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const uploadDocumentToStorage = async (
  file: File,
  setUploadProgress: (progress: number) => void,
): Promise<string> => {
  try {
    // Set initial progress for better UX
    setUploadProgress(10);

    const timestamp = new Date().getTime();
    const fileExt = file.name.split('.').pop();
    const filePath = `${timestamp}_${file.name}`;

    console.log('Uploading document to storage:', filePath);

    const { data, error } = await supabase.storage
      .from('employee_documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true, // Changed to true to allow overwriting files with same name
      });

    setUploadProgress(50);

    // Add a small delay to simulate progress
    await new Promise((resolve) => setTimeout(resolve, 500));
    setUploadProgress(80);

    await new Promise((resolve) => setTimeout(resolve, 200));
    setUploadProgress(100);

    if (error) {
      console.error('Supabase storage upload error:', error);
      throw error;
    }

    console.log('Document uploaded successfully:', data?.path);
    return filePath;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw new Error('Failed to upload document');
  }
};
