
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

import { useInvoiceFileUpload } from '../hooks/useInvoiceFileUpload';
import { useInvoiceEmail } from '../hooks/useInvoiceEmail';
import FileUploadArea from './FileUploadArea';
import FileList from './FileList';
import UploadGuidelines from './UploadGuidelines';

const InvoiceUpload: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const { 
    selectedFiles, 
    uploadedFiles,
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
    resetFiles
  } = useInvoiceFileUpload();
  
  const { sendInvoiceByEmail, isSending } = useInvoiceEmail();
  const [emailSent, setEmailSent] = useState(false);

  const handleSendEmail = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No files processed',
        description: 'Please wait for files to finish uploading.',
      });
      return;
    }

    try {
      // Send email notification with file attachments
      const emailSuccess = await sendInvoiceByEmail({
        invoiceType: 'outgoing',
        files: uploadedFiles
      });
      
      setEmailSent(emailSuccess);
      
      if (emailSuccess) {
        // Reset the file input after a successful email
        setTimeout(() => {
          resetFiles();
        }, 3000);
      }
      
    } catch (error) {
      console.error('Error during email process:', error);
      
      toast({
        variant: 'destructive',
        title: 'Email Failed',
        description: 'An error occurred while sending the email.',
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
        {!isLoading && !uploadComplete && (
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
          uploadedFiles={uploadedFiles}
          onRemoveFile={handleRemoveFile}
          onSendEmail={handleSendEmail}
          isLoading={isLoading}
          isSending={isSending}
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
