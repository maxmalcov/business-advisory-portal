
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useSupplierFileUpload } from '../hooks/useSupplierFileUpload';
import { useSupplierInvoiceEmail } from '../hooks/useSupplierInvoiceEmail';
import SupplierFileUploadArea from './SupplierFileUploadArea';
import SupplierFileList from './SupplierFileList';
import UploadGuidelines from './UploadGuidelines';

const SupplierInvoiceUpload: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const { 
    selectedFiles, 
    isDragging, 
    isLoading, 
    uploadProgress,
    uploadComplete, 
    setIsLoading,
    handleFileChange, 
    handleDragOver, 
    handleDragLeave, 
    handleDrop, 
    handleRemoveFile,
    uploadFilesToSupabase,
    resetFiles
  } = useSupplierFileUpload();
  
  const { sendInvoiceByEmail, isSending } = useSupplierInvoiceEmail();

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No files selected',
        description: 'Please select files to upload.',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Upload files to Supabase
      const uploadSuccess = await uploadFilesToSupabase();
      
      if (!uploadSuccess) {
        setIsLoading(false);
        return;
      }
      
      // Send email notification
      const emailSent = await sendInvoiceByEmail({ files: selectedFiles });
      
      // Show success message
      toast({
        title: 'Upload Successful',
        description: `${selectedFiles.length} supplier invoice(s) uploaded successfully${emailSent ? ' and email notification sent' : ''}.`,
      });

      // Reset the file input after a short delay to show completion state
      setTimeout(() => {
        resetFiles();
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error during upload process:', error);
      
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: 'An error occurred during the upload process.',
      });
      
      setIsLoading(false);
    }
  };

  const handleFileSelect = () => {
    document.getElementById('supplier-file-upload')?.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Supplier Invoices</CardTitle>
        <CardDescription>
          Upload invoices received from your suppliers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload guidelines */}
        <UploadGuidelines
          emailAddress={user?.incomingInvoiceEmail}
        />
        
        {/* File upload area */}
        <SupplierFileUploadArea 
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onFileSelect={handleFileSelect}
          isLoading={isLoading || isSending}
        />
        
        {/* Hidden file input */}
        <input
          type="file"
          id="supplier-file-upload"
          className="hidden"
          multiple
          accept=".pdf,.jpg,.jpeg"
          onChange={handleFileChange}
        />
        
        {/* Selected files list with progress */}
        <SupplierFileList 
          files={selectedFiles}
          onRemoveFile={handleRemoveFile}
          onUpload={handleUpload}
          isLoading={isLoading || isSending}
          uploadProgress={uploadProgress}
          uploadComplete={uploadComplete}
        />
      </CardContent>
    </Card>
  );
};

export default SupplierInvoiceUpload;
