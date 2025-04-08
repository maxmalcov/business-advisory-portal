
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
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  onFileChange
}) => {
  return (
    <>
      {/* Only show file upload area if not currently uploading */}
      {!isLoading && !uploadComplete && (
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
        onChange={onFileChange}
      />
      
      {/* Selected files list with progress */}
      {selectedFiles.length > 0 && (
        <SupplierFileList 
          files={selectedFiles}
          uploadedFiles={uploadedFiles}
          onRemoveFile={onRemoveFile}
          onSendEmail={onSendEmail}
          isLoading={isLoading}
          isSending={isSending}
          uploadProgress={uploadProgress}
          uploadComplete={uploadComplete}
          uploadSuccess={uploadSuccess}
          uploadError={uploadError}
        />
      )}
    </>
  );
};

export default SupplierFileUploadSection;
