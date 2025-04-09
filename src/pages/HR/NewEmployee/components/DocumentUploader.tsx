
import { supabase } from '@/integrations/supabase/client';

export const uploadDocumentToStorage = async (
  file: File,
  setUploadProgress: (progress: number) => void
): Promise<string> => {
  try {
    const timestamp = new Date().getTime();
    const filePath = `${timestamp}_${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('employee_documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    setUploadProgress(50);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setUploadProgress(100);
    
    if (error) {
      throw error;
    }
    
    return filePath;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw new Error('Failed to upload document');
  }
};
