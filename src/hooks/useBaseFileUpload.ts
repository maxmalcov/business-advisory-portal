
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/context/AuthContext';

export interface FileUploadOptions {
  maxFiles?: number;
  maxSizeInMB?: number;
  allowedTypes?: string[];
}

export interface UploadConfig {
  bucketName: string;
  folderPath: string;
  invoiceType: 'sale' | 'supplier';
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  path: string;
}

export const useBaseFileUpload = (options: FileUploadOptions = {}, uploadConfig: UploadConfig) => {
  const {
    maxFiles = 15,
    maxSizeInMB = 25,
    allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg'],
  } = options;
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const validateFiles = (files: File[]): File[] => {
    if (files.length > maxFiles) {
      toast({
        variant: 'destructive',
        title: 'Too many files',
        description: `You can upload a maximum of ${maxFiles} files at once.`,
      });
      return [];
    }
    
    return files.filter(file => {
      const isValidType = allowedTypes.includes(file.type);
      const isValidSize = file.size <= maxSizeInMB * 1024 * 1024;
      
      if (!isValidType) {
        toast({
          variant: 'destructive',
          title: 'Invalid file type',
          description: `${file.name} is not a supported file type.`,
        });
      }
      
      if (!isValidSize) {
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: `${file.name} exceeds the ${maxSizeInMB}MB limit.`,
        });
      }
      
      return isValidType && isValidSize;
    });
  };

  const handleFiles = (fileList: FileList | null) => {
    setUploadComplete(false);
    setUploadSuccess(false);
    setUploadError(null);
    setUploadProgress(0);
    setUploadedFiles([]);
    
    if (!fileList) return;
    
    const files = Array.from(fileList);
    const validFiles = validateFiles(files);
    
    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
      uploadFilesToSupabase(validFiles);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => {
      const newFiles = prev.filter((_, i) => i !== index);
      if (newFiles.length === 0) {
        setUploadComplete(false);
        setUploadSuccess(false);
        setUploadError(null);
        setUploadProgress(0);
        setUploadedFiles([]);
      }
      return newFiles;
    });
  };

  const uploadFilesToSupabase = async (filesToUpload: File[] = selectedFiles) => {
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
    setUploadComplete(false);
    setUploadSuccess(false);
    setUploadError(null);
    setUploadedFiles([]);

    let totalSize = 0;
    const totalFiles = filesToUpload.length;
    let uploadedFiles = 0;
    const newUploadedFiles: UploadedFile[] = [];

    try {
      console.log(`Starting upload process to bucket: ${uploadConfig.bucketName}`);
      
      filesToUpload.forEach(file => {
        totalSize += file.size;
      });

      let uploadedSize = 0;

      for (const file of filesToUpload) {
        const fileId = uuidv4();
        const fileExtension = file.name.split('.').pop();
        const storagePath = `${uploadConfig.folderPath}/${user.id}/${fileId}.${fileExtension}`;
        
        console.log(`Uploading file to: ${uploadConfig.bucketName}/${storagePath}`);
        
        // Check if bucket exists before uploading
        const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
        
        if (bucketError) {
          console.error('Error listing buckets:', bucketError);
          throw new Error(`Failed to list storage buckets: ${bucketError.message}`);
        }
        
        const bucketExists = buckets.some(bucket => bucket.name === uploadConfig.bucketName);
        
        if (!bucketExists) {
          throw new Error(`Bucket "${uploadConfig.bucketName}" does not exist`);
        }
        
        const { data, error } = await supabase.storage
          .from(uploadConfig.bucketName)
          .upload(storagePath, file, {
            cacheControl: '3600',
            upsert: false
          });
          
        if (error) {
          console.error('Error uploading file:', error);
          throw new Error(`Failed to upload file: ${error.message}`);
        }
        
        console.log('File uploaded successfully:', data);
        
        const recordId = uuidv4();
        
        console.log('Creating database record for file with ID:', recordId);
        
        // Use the generic query method to avoid type issues
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
          throw new Error(`Failed to store file metadata: ${dbError.message}`);
        }
        
        console.log('File metadata stored successfully:', insertedData);
        
        newUploadedFiles.push({
          id: recordId,
          name: file.name,
          size: file.size,
          path: storagePath
        });
        
        uploadedSize += file.size;
        uploadedFiles++;
        
        const newProgress = Math.round((uploadedSize / totalSize) * 100);
        setUploadProgress(newProgress);
      }
      
      setUploadedFiles(newUploadedFiles);
      setUploadComplete(true);
      setUploadSuccess(true);
      
      toast({
        title: 'Upload Complete',
        description: `${totalFiles} file${totalFiles > 1 ? 's' : ''} uploaded successfully.`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadSuccess(false);
      setUploadComplete(true);
      
      setUploadError(error.message || 'There was an error uploading your files.');
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: error.message || 'There was an error uploading your files.',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetFiles = () => {
    setSelectedFiles([]);
    setUploadedFiles([]);
    setUploadProgress(0);
    setUploadComplete(false);
    setUploadSuccess(false);
    setUploadError(null);
    setIsLoading(false);
  };

  return {
    selectedFiles,
    uploadedFiles,
    isDragging,
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
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemoveFile,
    uploadFilesToSupabase,
    resetFiles,
  };
};
