
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
import UploadGuidelines from './UploadGuidelines';
import FileUploadSection from './FileUploadSection';

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
  
  const handleResetUpload = () => {
    resetFiles();
  };

  const handleAddMoreFiles = () => {
    document.getElementById('file-upload')?.click();
  };

  // For handling drag and drop with append mode
  const handleDragOverAppend = (e: React.DragEvent<HTMLDivElement>) => {
    handleDragOver(e);
  };

  const handleDropAppend = (e: React.DragEvent<HTMLDivElement>) => {
    if (uploadComplete && uploadSuccess) {
      // In append mode
      handleDrop(e, true);
    } else {
      // In regular mode
      handleDrop(e);
    }
  };

  // For handling file input change with append mode
  const handleFileChangeWithMode = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (uploadComplete && uploadSuccess) {
      // In append mode
      handleFileChange(e, true);
    } else {
      // In regular mode
      handleFileChange(e);
    }
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
        
        {/* File upload section */}
        <FileUploadSection
          selectedFiles={selectedFiles}
          uploadedFiles={uploadedFiles}
          isDragging={isDragging}
          isLoading={isLoading}
          isSending={isSending}
          uploadProgress={uploadProgress}
          uploadComplete={uploadComplete}
          uploadSuccess={uploadSuccess}
          uploadError={uploadError}
          onDragOver={handleDragOverAppend}
          onDragLeave={handleDragLeave}
          onDrop={handleDropAppend}
          onFileSelect={handleFileSelect}
          onRemoveFile={handleRemoveFile}
          onSendEmail={handleSendEmail}
          onResetUpload={handleResetUpload}
          onAddMoreFiles={handleAddMoreFiles}
          onFileChange={handleFileChangeWithMode}
        />
      </CardContent>
    </Card>
  );
};

export default InvoiceUpload;
