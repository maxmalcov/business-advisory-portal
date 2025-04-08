
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

export const useSupplierFileUpload = (options: FileUploadOptions = {}) => {
  const {
    maxFiles = 15,
    maxSizeInMB = 25,
    allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg'],
  } = options;
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const validateFiles = (files: File[]): File[] => {
    // Check number of files
    if (files.length > maxFiles) {
      toast({
        variant: 'destructive',
        title: 'Too many files',
        description: `You can upload a maximum of ${maxFiles} files at once.`,
      });
      return [];
    }
    
    // Check file types and sizes
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
    if (!fileList) return;
    
    const files = Array.from(fileList);
    const validFiles = validateFiles(files);
    
    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
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
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFilesToSupabase = async () => {
    if (!user || !user.id) {
      toast({
        variant: 'destructive',
        title: 'Authentication required',
        description: 'You must be logged in to upload files.',
      });
      return false;
    }

    let totalSize = 0;
    const totalFiles = selectedFiles.length;
    let uploadedFiles = 0;

    try {
      // Calculate total size for progress tracking
      selectedFiles.forEach(file => {
        totalSize += file.size;
      });

      let uploadedSize = 0;

      // Upload each file
      for (const file of selectedFiles) {
        const fileId = uuidv4();
        const fileExtension = file.name.split('.').pop();
        const storagePath = `supplier-invoices/${user.id}/${fileId}.${fileExtension}`;
        
        // Upload file to Supabase Storage
        const { data, error } = await supabase.storage
          .from('invoices')
          .upload(storagePath, file, {
            cacheControl: '3600',
            upsert: false
          });
          
        if (error) {
          console.error('Error uploading file:', error);
          throw error;
        }
        
        // Store metadata in the database
        const { error: dbError } = await supabase
          .from('invoice_files')
          .insert({
            user_id: user.id,
            file_path: storagePath,
            file_name: file.name,
            file_size: file.size,
            invoice_type: 'supplier',
            storage_path: data.path
          });
          
        if (dbError) {
          console.error('Error storing file metadata:', dbError);
          throw dbError;
        }
        
        // Update progress
        uploadedSize += file.size;
        uploadedFiles++;
        
        const newProgress = Math.round((uploadedSize / totalSize) * 100);
        setUploadProgress(newProgress);
        
        // If all files are processed, set upload to complete
        if (uploadedFiles === totalFiles) {
          setUploadComplete(true);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: 'There was an error uploading your files.',
      });
      return false;
    }
  };

  const resetFiles = () => {
    setSelectedFiles([]);
    setUploadProgress(0);
    setUploadComplete(false);
  };

  return {
    selectedFiles,
    isDragging,
    isLoading,
    uploadProgress,
    uploadComplete,
    setIsLoading,
    setUploadProgress,
    setUploadComplete,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemoveFile,
    uploadFilesToSupabase,
    resetFiles,
  };
};
