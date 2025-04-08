
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
import UploadGuidelines from './UploadGuidelines';
import SupplierFileUploadSection from './SupplierFileUploadSection';

const SupplierInvoiceUpload: React.FC = () => {
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
  } = useSupplierFileUpload();
  
  const { sendInvoiceByEmail, isSending } = useSupplierInvoiceEmail();
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
        
        {/* File upload section */}
        <SupplierFileUploadSection
          selectedFiles={selectedFiles}
          uploadedFiles={uploadedFiles}
          isDragging={isDragging}
          isLoading={isLoading}
          isSending={isSending}
          uploadProgress={uploadProgress}
          uploadComplete={uploadComplete}
          uploadSuccess={uploadSuccess}
          uploadError={uploadError}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onFileSelect={handleFileSelect}
          onRemoveFile={handleRemoveFile}
          onSendEmail={handleSendEmail}
          onFileChange={handleFileChange}
        />
      </CardContent>
    </Card>
  );
};

export default SupplierInvoiceUpload;
