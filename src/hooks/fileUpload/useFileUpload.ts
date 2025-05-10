import { useCallback } from 'react';
import { useFileSelection } from './useFileSelection';
import { useFileUploader } from './useFileUploader';
import { FileUploadOptions, UploadConfig, FileUploadReturn } from './types';

export const useFileUpload = (
  options: FileUploadOptions = {},
  uploadConfig: UploadConfig,
): FileUploadReturn => {
  const fileSelection = useFileSelection(options);
  const fileUploader = useFileUploader(uploadConfig);

  const handleFilesUploaded = useCallback(
    (files: File[]) => {
      fileUploader.uploadFilesToSupabase(files);
    },
    [fileUploader.uploadFilesToSupabase],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, append: boolean = false) => {
      fileSelection.handleFileChange(e, handleFilesUploaded, append);
    },
    [fileSelection.handleFileChange, handleFilesUploaded],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, append: boolean = false) => {
      fileSelection.handleDrop(e, handleFilesUploaded, append);
    },
    [fileSelection.handleDrop, handleFilesUploaded],
  );

  const uploadFilesToSupabase = useCallback(
    (filesToUpload: File[] = fileSelection.selectedFiles) => {
      return fileUploader.uploadFilesToSupabase(filesToUpload);
    },
    [fileSelection.selectedFiles, fileUploader.uploadFilesToSupabase],
  );

  const resetFiles = useCallback(() => {
    fileSelection.resetFiles();
    fileUploader.resetUploadState();
  }, [fileSelection.resetFiles, fileUploader.resetUploadState]);

  // Add new function to handle "Upload More Files" button click
  const handleAddMoreFiles = useCallback(() => {
    if (!fileSelection.hasReachedFileLimit()) {
      document.getElementById('file-upload')?.click();
    }
  }, [fileSelection.hasReachedFileLimit]);

  const handleSupplierAddMoreFiles = useCallback(() => {
    if (!fileSelection.hasReachedFileLimit()) {
      document.getElementById('supplier-file-upload')?.click();
    }
  }, [fileSelection.hasReachedFileLimit]);

  return {
    // State from selection hook
    selectedFiles: fileSelection.selectedFiles,
    isDragging: fileSelection.isDragging,

    // State from uploader hook
    uploadedFiles: fileUploader.uploadedFiles,
    isLoading: fileUploader.isLoading,
    uploadProgress: fileUploader.uploadProgress,
    uploadComplete: fileUploader.uploadComplete,
    uploadSuccess: fileUploader.uploadSuccess,
    uploadError: fileUploader.uploadError,

    // Actions from uploader hook
    setIsLoading: fileUploader.setIsLoading,
    setUploadProgress: fileUploader.setUploadProgress,
    setUploadComplete: fileUploader.setUploadComplete,
    setUploadSuccess: fileUploader.setUploadSuccess,
    setUploadError: fileUploader.setUploadError,

    // Combined actions
    handleFileChange,
    handleDragOver: fileSelection.handleDragOver,
    handleDragLeave: fileSelection.handleDragLeave,
    handleDrop,
    handleRemoveFile: fileSelection.handleRemoveFile,
    uploadFilesToSupabase,
    resetFiles,
    handleAddMoreFiles,
    handleSupplierAddMoreFiles,

    // File limit helpers
    getRemainingFilesCount: fileSelection.getRemainingFilesCount,
    hasReachedFileLimit: fileSelection.hasReachedFileLimit,
  };
};
