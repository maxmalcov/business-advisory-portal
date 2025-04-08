
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

import { useSaleFileUpload } from '../hooks/useSaleFileUpload';
import { useSaleInvoiceEmail } from '../hooks/useSaleInvoiceEmail';
import SaleFileUploadArea from './SaleFileUploadArea';
import SaleFileList from './SaleFileList';
import UploadGuidelines from './UploadGuidelines';

const SaleInvoiceUpload: React.FC = () => {
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
  } = useSaleFileUpload();
  
  const { sendInvoiceByEmail, isSending } = useSaleInvoiceEmail();
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
    document.getElementById('sale-file-upload')?.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Sale Invoices</CardTitle>
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
          <SaleFileUploadArea 
            isDragging={isDragging}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onFileSelect={handleFileSelect}
            isLoading={isLoading || isSending}
          />
        )}
        
        {/* Hidden file input */}
        <input
          type="file"
          id="sale-file-upload"
          className="hidden"
          multiple
          accept=".pdf,.jpg,.jpeg"
          onChange={handleFileChange}
        />
        
        {/* Selected files list with progress */}
        <SaleFileList 
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

export default SaleInvoiceUpload;
