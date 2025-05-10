import React from 'react';
import SupplierFileUploadArea from './SupplierFileUploadArea';
import SupplierFileList from './SupplierFileList';
import { UploadedFile } from '@/hooks/useBaseFileUpload';

interface SupplierFileUploadSectionProps {
  selectedFiles: File[];
  uploadedFiles: UploadedFile[];
  isDragging: boolean;
  isLoading: boolean;
  isSending: boolean;
  uploadProgress: number;
  uploadComplete: boolean;
  uploadSuccess: boolean;
  uploadError: string | null;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileSelect: () => void;
  onRemoveFile: (index: number) => void;
  onSendEmail: () => void;
  onResetUpload: () => void;
  onAddMoreFiles: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  remainingFilesCount?: number;
  hasReachedFileLimit?: boolean;
}

const SupplierFileUploadSection: React.FC<SupplierFileUploadSectionProps> = ({
  selectedFiles,
  uploadedFiles,
  isDragging,
  isLoading,
  isSending,
  uploadProgress,
  uploadComplete,
  uploadSuccess,
  uploadError,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  onRemoveFile,
  onSendEmail,
  onResetUpload,
  onAddMoreFiles,
  onFileChange,
  remainingFilesCount,
  hasReachedFileLimit,
}) => {
  return (
    <>
      {/* Only show file upload area if not currently uploading and file limit not reached */}
      {!isLoading && !uploadComplete && !hasReachedFileLimit && (
        <SupplierFileUploadArea
          isDragging={isDragging}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onFileSelect={onFileSelect}
          isLoading={isLoading || isSending}
        />
      )}

      {/* Hidden file input */}
      <input
        type="file"
        id="supplier-file-upload"
        className="hidden"
        multiple
        accept=".pdf,.jpg,.jpeg"
        onChange={(e) => onFileChange(e)}
        disabled={hasReachedFileLimit}
      />

      {/* Selected files list with progress */}
      {selectedFiles.length > 0 && (
        <SupplierFileList
          files={selectedFiles}
          uploadedFiles={uploadedFiles}
          onRemoveFile={onRemoveFile}
          onSendEmail={onSendEmail}
          onResetUpload={onResetUpload}
          onAddMoreFiles={onAddMoreFiles}
          isLoading={isLoading}
          isSending={isSending}
          uploadProgress={uploadProgress}
          uploadComplete={uploadComplete}
          uploadSuccess={uploadSuccess}
          uploadError={uploadError}
          remainingFilesCount={remainingFilesCount}
          hasReachedFileLimit={hasReachedFileLimit}
        />
      )}
    </>
  );
};

export default SupplierFileUploadSection;
