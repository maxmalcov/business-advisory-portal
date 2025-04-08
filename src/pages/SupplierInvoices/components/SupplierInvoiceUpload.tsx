
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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  
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
  } = useSupplierFileUpload();
  
  const { sendInvoiceByEmail, isSending } = useSupplierInvoiceEmail();

  const simulateProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress > 95) {
        clearInterval(interval);
        setUploadProgress(100);
        
        // Small delay before marking as complete for better UX
        setTimeout(() => {
          setUploadComplete(true);
        }, 500);
      } else {
        setUploadProgress(Math.min(progress, 95));
      }
    }, 300);
    
    return interval;
  };

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
    setUploadProgress(0);
    setUploadComplete(false);
    
    // Start progress simulation
    const progressInterval = simulateProgress();

    try {
      // Here we would normally upload the files to the server
      // For now, we'll just simulate uploading and send the email notification
      
      // Simulate a delay for the upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Stop progress simulation and set to 100%
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadComplete(true);
      
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
        setUploadProgress(0);
        setUploadComplete(false);
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error during upload process:', error);
      // Stop progress simulation
      clearInterval(progressInterval);
      
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: 'An error occurred during the upload process.',
      });
      
      setIsLoading(false);
      setUploadProgress(0);
      setUploadComplete(false);
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
