
import React from 'react';
import FileUploadArea from './FileUploadArea';
import FileList from './FileList';
import { UploadedFile } from '@/hooks/fileUpload';

interface FileUploadSectionProps {
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
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
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
  onFileChange
}) => {
  return (
    <>
      {/* Only show file upload area if not currently uploading */}
      {!isLoading && !uploadComplete && (
        <FileUploadArea 
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
        id="file-upload"
        className="hidden"
        multiple
        accept=".pdf,.jpg,.jpeg"
        onChange={(e) => onFileChange(e)}
      />
      
      {/* Selected files list */}
      {selectedFiles.length > 0 && (
        <FileList 
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
        />
      )}
    </>
  );
};

export default FileUploadSection;
