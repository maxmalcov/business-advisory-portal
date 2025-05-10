import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useInvoiceFileUpload } from '../hooks/useInvoiceFileUpload';
import { useInvoiceEmail } from '../hooks/useInvoiceEmail';
import UploadGuidelines from './UploadGuidelines';
import FileUploadSection from './FileUploadSection';
import { sendEmail } from '@/integrations/email';
import { log } from '@/utils/logs/log.funciton.ts';
import { useLanguage } from '@/context/LanguageContext.tsx';
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
    resetFiles,
    getRemainingFilesCount,
    hasReachedFileLimit,
  } = useInvoiceFileUpload();
  const { sendInvoiceByEmail, isSending } = useInvoiceEmail();
  const { t } = useLanguage();
  const [emailSent, setEmailSent] = useState(false);
  const handleSendEmail = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        variant: 'destructive',
        title: t('invoices.toast.no-files.title'),
        description: t('invoices.toast.no-files.description'),
      });
      return;
    }
    try {
      sendEmail(
        user.outgoingInvoiceEmail,
        'New invoice',
        `New sale invoice was uploaded by ${user.name}`,
      );

      log({
        action: 'Invoice uploaded',
        description: `Sale invoice uploaded by ${user.name}`,
        user: user.email,
        level: 'info',
        category: 'invoice',
      });
    } catch (error) {
      console.error('Error during email process:', error);
      toast({
        variant: 'destructive',
        title: t('invoices.toast.email-error.title'),
        description: t('invoices.toast.email-error.description'),
      });
    }
  };
  const handleFileSelect = () => {
    if (!hasReachedFileLimit?.()) {
      document.getElementById('file-upload')?.click();
    } else {
      toast({
        variant: 'destructive',
        title: t('invoices.toast.file-limit.title'),
        description: t('invoices.toast.file-limit.description'),
      });
    }
  };
  const handleResetUpload = () => {
    resetFiles();
  };
  const handleAddMoreFiles = () => {
    if (!hasReachedFileLimit?.()) {
      document.getElementById('file-upload')?.click();
    } else {
      toast({
        variant: 'destructive',
        title: t('invoices.toast.file-limit.title'),
        description: t('invoices.toast.file-limit.description'),
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
  return (
    <Card className="transition-all duration-200 hover:shadow-md border-primary/10">
      <CardHeader className="space-y-1 py-[10px]">
        {/* Removed CardTitle */}
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Upload guidelines with enhanced styling */}
        <div className="bg-muted/50 rounded-lg p-6">
          <UploadGuidelines
            emailAddress={user?.outgoingInvoiceEmail}
            emailType="outgoing"
          />
        </div>

        {/* File upload section with enhanced styling */}
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
          remainingFilesCount={remainingFilesCount}
          hasReachedFileLimit={fileLimit}
        />
      </CardContent>
    </Card>
  );
};
export default InvoiceUpload;
