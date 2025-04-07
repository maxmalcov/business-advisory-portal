
import React from 'react';
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
    setIsLoading,
    handleFileChange, 
    handleDragOver, 
    handleDragLeave, 
    handleDrop, 
    handleRemoveFile,
    resetFiles
  } = useFileUpload();
  
  const { sendInvoiceByEmail, isSending } = useInvoiceEmail();

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
      // Here we would normally upload the files to the server
      // For now, we'll just simulate uploading and send the email notification
      
      // Send email notification
      const emailSent = await sendInvoiceByEmail({
        invoiceType: 'outgoing',
        files: selectedFiles
      });
      
      // Show success message
      toast({
        title: 'Upload Successful',
        description: `${selectedFiles.length} invoice(s) uploaded successfully${emailSent ? ' and email notification sent' : ''}.`,
      });

      // Reset the file input
      resetFiles();
    } catch (error) {
      console.error('Error during upload process:', error);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: 'An error occurred during the upload process.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = () => {
    document.getElementById('file-upload')?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e);
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
        
        {/* File upload area */}
        <FileUploadArea 
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onFileSelect={handleFileSelect}
          isLoading={isLoading || isSending}
        />
        
        {/* Hidden file input used by FileUploadArea */}
        <input
          type="file"
          id="file-upload"
          className="hidden"
          multiple
          accept=".pdf,.jpg,.jpeg"
          onChange={handleInputChange}
        />
        
        {/* Selected files list */}
        <FileList 
          files={selectedFiles}
          onRemoveFile={handleRemoveFile}
          onUpload={handleUpload}
          isLoading={isLoading || isSending}
        />
      </CardContent>
    </Card>
  );
};

export default InvoiceUpload;
