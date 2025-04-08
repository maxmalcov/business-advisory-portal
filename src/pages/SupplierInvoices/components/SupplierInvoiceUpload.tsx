
import React from 'react';
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
  } = useSupplierFileUpload();
  
  const { sendInvoiceByEmail, isSending } = useSupplierInvoiceEmail();

  const handleUpload = async () => {
    setIsLoading(true);

    try {
      // Here we would normally upload the files to the server
      // For now, we'll just simulate uploading and send the email notification
      
      // Send email notification
      const emailSent = await sendInvoiceByEmail({ files: selectedFiles });
      
      // Show success message in useSupplierInvoiceEmail hook
      
      // Reset the file input
      resetFiles();
    } catch (error) {
      console.error('Error during upload process:', error);
    } finally {
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
        
        {/* Selected files list */}
        <SupplierFileList 
          files={selectedFiles}
          onRemoveFile={handleRemoveFile}
          onUpload={handleUpload}
          isLoading={isLoading || isSending}
        />
      </CardContent>
    </Card>
  );
};

export default SupplierInvoiceUpload;
