
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

import { useFileUpload } from '../hooks/useFileUpload';
import { useInvoiceEmail } from '../hooks/useInvoiceEmail';
import FileUploadArea from './FileUploadArea';
import FileList from './FileList';
import UploadGuidelines from './UploadGuidelines';

const InvoiceUpload: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const { 
    selectedFiles, 
    isDragging, 
    isLoading, 
    uploadProgress,
    uploadComplete,
    uploadSuccess,
    uploadError,
    setIsLoading,
    handleFileChange, 
    handleDragOver, 
    handleDragLeave, 
    handleDrop, 
    handleRemoveFile,
    uploadFilesToSupabase,
    resetFiles
  } = useFileUpload();
  
  const { sendInvoiceByEmail, isSending } = useInvoiceEmail();
  const [emailSent, setEmailSent] = useState(false);

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
        return; // Error is already handled in the hook
      }
      
      // Send email notification
      const emailSuccess = await sendInvoiceByEmail({
        invoiceType: 'outgoing',
        files: selectedFiles
      });
      setEmailSent(emailSuccess);
      
      // Show success message
      toast({
        title: 'Success',
        description: `${selectedFiles.length} invoice(s) uploaded successfully${emailSuccess ? ' and email notification sent' : ''}.`,
      });

      // Reset the file input after a short delay to show completion state
      setTimeout(() => {
        resetFiles();
      }, 3000);
      
    } catch (error) {
      console.error('Error during upload process:', error);
      
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: 'An error occurred during the upload process.',
      });
    }
  };

  const handleFileSelect = () => {
    document.getElementById('file-upload')?.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload</CardTitle>
        <CardDescription>
          Upload your sales invoices for processing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload guidelines */}
        <UploadGuidelines 
          emailAddress={user?.outgoingInvoiceEmail}
          emailType="outgoing"
        />
        
        {/* Only show file upload area if not currently uploading */}
        {!isLoading && (
          <FileUploadArea 
            isDragging={isDragging}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onFileSelect={handleFileSelect}
            isLoading={isLoading || isSending}
          />
        )}
        
        {/* Hidden file input used by FileUploadArea */}
        <input
          type="file"
          id="file-upload"
          className="hidden"
          multiple
          accept=".pdf,.jpg,.jpeg"
          onChange={handleFileChange}
        />
        
        {/* Selected files list */}
        <FileList 
          files={selectedFiles}
          onRemoveFile={handleRemoveFile}
          onUpload={handleUpload}
          isLoading={isLoading || isSending}
          uploadProgress={uploadProgress}
          uploadComplete={uploadComplete}
          uploadSuccess={uploadSuccess}
          uploadError={uploadError}
        />
      </CardContent>
    </Card>
  );
};

export default InvoiceUpload;
