
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Generate a temporary URL for viewing a document
 * @param documentPath Path to the document in storage
 * @returns Signed URL for the document
 */
export const getDocumentUrl = async (documentPath: string) => {
  if (!documentPath) {
    throw new Error('No document path provided');
  }
  
  const { data, error } = await supabase.storage
    .from('employee_documents')
    .createSignedUrl(documentPath, 60); // URL valid for 60 seconds
  
  if (error) {
    throw error;
  }
  
  if (!data || !data.signedUrl) {
    throw new Error('Could not generate document URL');
  }
  
  return data.signedUrl;
};

/**
 * Extract a filename from a storage path
 * @param path Full storage path
 * @returns Filename portion of the path
 */
export const getDocumentFilename = (path: string): string => {
  return path.split('/').pop() || path;
};
