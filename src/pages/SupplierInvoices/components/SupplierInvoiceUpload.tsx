import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useSupplierFileUpload } from '../hooks/useSupplierFileUpload';
import { useSupplierInvoiceEmail } from '../hooks/useSupplierInvoiceEmail';
import UploadGuidelines from './UploadGuidelines';
import SupplierFileUploadSection from './SupplierFileUploadSection';
import {sendEmail} from "@/integrations/email";
import {log} from "@/utils/logs/log.funciton.ts";
import {useLanguage} from "@/context/LanguageContext.tsx";
const SupplierInvoiceUpload: React.FC = () => {
  const {
    toast
  } = useToast();
  const {
    user
  } = useAuth();
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
    resetFiles,
    getRemainingFilesCount,
    hasReachedFileLimit
  } = useSupplierFileUpload();
  const {
    sendInvoiceByEmail,
    isSending
  } = useSupplierInvoiceEmail();
  const { t } = useLanguage()
  const [emailSent, setEmailSent] = useState(false);
  const handleSendEmail = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        variant: 'destructive',
        title: t('invoices.toast.no-files.title'),
        description: t('invoices.toast.no-files.description')
      });
      return;
    }
    try {
      sendEmail(user.incomingInvoiceEmail, 'New invoice', `New supplier invoice was uploaded by ${user.name}`)

      log({ action: 'Invoice uploaded', description: `Supplier invoice uploaded by ${user.name}`, user: user.email, level: 'info', category: 'invoice'})
      } catch (error) {
      console.error('Error during email process:', error);
      toast({
        variant: 'destructive',
        title: t('invoices.toast.email-error.title'),
        description: t('invoices.toast.email-error.description')
      });
    }
  };
  const handleFileSelect = () => {
    if (!hasReachedFileLimit?.()) {
      document.getElementById('supplier-file-upload')?.click();
    } else {
      toast({
        variant: 'destructive',
        title: t('invoices.toast.file-limit.title'),
        description: t('invoices.toast.file-limit.description')
      });
    }
  };
  const handleResetUpload = () => {
    resetFiles();
  };
  const handleAddMoreFiles = () => {
    if (!hasReachedFileLimit?.()) {
      document.getElementById('supplier-file-upload')?.click();
    } else {
      toast({
        variant: 'destructive',
        title: t('invoices.toast.file-limit.title'),
        description: t('invoices.toast.file-limit.description')
      });
    }
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
  const remainingFilesCount = getRemainingFilesCount?.() || 0;
  const fileLimit = hasReachedFileLimit?.() || false;
  return <Card className="transition-all duration-200 hover:shadow-md border-primary/10">
      <CardHeader className="space-y-1 py-[10px]" />
      <CardContent className="space-y-8">
        <div className="bg-muted/50 rounded-lg p-6">
          <UploadGuidelines emailAddress={user?.incomingInvoiceEmail} emailType="incoming" />
        </div>
        
        <SupplierFileUploadSection selectedFiles={selectedFiles} uploadedFiles={uploadedFiles} isDragging={isDragging} isLoading={isLoading} isSending={isSending} uploadProgress={uploadProgress} uploadComplete={uploadComplete} uploadSuccess={uploadSuccess} uploadError={uploadError} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onFileSelect={handleFileSelect} onRemoveFile={handleRemoveFile} onSendEmail={handleSendEmail} onResetUpload={handleResetUpload} onAddMoreFiles={handleAddMoreFiles} onFileChange={handleFileChange} remainingFilesCount={remainingFilesCount} hasReachedFileLimit={fileLimit} />
      </CardContent>
    </Card>;
};
export default SupplierInvoiceUpload;