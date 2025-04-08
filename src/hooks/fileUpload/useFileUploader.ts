
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/context/AuthContext';
import { UploadConfig, UploadedFile } from './types';

export const useFileUploader = (uploadConfig: UploadConfig) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const uploadFilesToSupabase = async (filesToUpload: File[]) => {
    if (!user || !user.id) {
      setUploadError('Authentication required');
      toast({
        variant: 'destructive',
        title: 'Authentication required',
        description: 'You must be logged in to upload files.',
      });
      return false;
    }

    if (filesToUpload.length === 0) {
      setUploadError('No files selected');
      return false;
    }

    setIsLoading(true);
    setUploadProgress(0);
    // Don't reset these on additional uploads
    // setUploadComplete(false);
    // setUploadSuccess(false);
    setUploadError(null);
    // Don't reset uploadedFiles - we'll append to it
    // setUploadedFiles([]);

    let totalSize = 0;
    const totalFiles = filesToUpload.length;
    let uploadedFilesCount = 0;
    const newUploadedFiles: UploadedFile[] = [];

    try {
      filesToUpload.forEach(file => {
        totalSize += file.size;
      });

      let uploadedSize = 0;

      for (const file of filesToUpload) {
        const fileId = uuidv4();
        const fileExtension = file.name.split('.').pop();
        const storagePath = `${uploadConfig.folderPath}/${user.id}/${fileId}.${fileExtension}`;
        
        const { data, error } = await supabase.storage
          .from(uploadConfig.bucketName)
          .upload(storagePath, file, {
            cacheControl: '3600',
            upsert: false
          });
          
        if (error) {
          console.error('Error uploading file:', error);
          setUploadError(error.message);
          throw error;
        }
        
        const recordId = uuidv4();
        
        const { error: dbError, data: insertedData } = await supabase
          .from('invoice_files' as any)
          .insert({
            id: recordId,
            user_id: user.id,
            file_path: storagePath,
            file_name: file.name,
            file_size: file.size,
            invoice_type: uploadConfig.invoiceType,
            storage_path: data.path
          } as any)
          .select('id')
          .single();
          
        if (dbError) {
          console.error('Error storing file metadata:', dbError);
          setUploadError(dbError.message);
          throw dbError;
        }
        
        newUploadedFiles.push({
          id: recordId,
          name: file.name,
          size: file.size,
          path: storagePath
        });
        
        uploadedSize += file.size;
        uploadedFilesCount++;
        
        const newProgress = Math.round((uploadedSize / totalSize) * 100);
        setUploadProgress(newProgress);
      }
      
      // Append new uploaded files to existing ones
      setUploadedFiles(prevFiles => [...prevFiles, ...newUploadedFiles]);
      setUploadComplete(true);
      setUploadSuccess(true);
      
      toast({
        title: 'Upload Complete',
        description: `${totalFiles} file${totalFiles > 1 ? 's' : ''} uploaded successfully.`,
      });
      
      return true;
    } catch (error) {
      console.error('Upload error:', error);
      setUploadSuccess(false);
      setUploadComplete(true);
      
      if (!uploadError) {
        setUploadError('There was an error uploading your files.');
        toast({
          variant: 'destructive',
          title: 'Upload failed',
          description: 'There was an error uploading your files.',
        });
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetUploadState = () => {
    setUploadedFiles([]);
    setUploadProgress(0);
    setUploadComplete(false);
    setUploadSuccess(false);
    setUploadError(null);
    setIsLoading(false);
  };

  return {
    uploadedFiles,
    isLoading,
    uploadProgress,
    uploadComplete,
    uploadSuccess,
    uploadError,
    setIsLoading,
    setUploadProgress,
    setUploadComplete,
    setUploadSuccess,
    setUploadError,
    uploadFilesToSupabase,
    resetUploadState,
  };
};
