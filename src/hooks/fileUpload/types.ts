
export interface FileUploadOptions {
  maxFiles?: number;
  maxSizeInMB?: number;
  allowedTypes?: string[];
}

export interface UploadConfig {
  bucketName: string;
  folderPath: string;
  invoiceType: 'sale' | 'supplier';
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  path: string;
}

export interface FileUploadState {
  selectedFiles: File[];
  uploadedFiles: UploadedFile[];
  isDragging: boolean;
  isLoading: boolean;
  uploadProgress: number;
  uploadComplete: boolean;
  uploadSuccess: boolean;
  uploadError: string | null;
}

export interface FileUploadActions {
  setIsLoading: (isLoading: boolean) => void;
  setUploadProgress: (progress: number) => void;
  setUploadComplete: (complete: boolean) => void;
  setUploadSuccess: (success: boolean) => void;
  setUploadError: (error: string | null) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleRemoveFile: (index: number) => void;
  uploadFilesToSupabase: (filesToUpload?: File[]) => Promise<boolean>;
  resetFiles: () => void;
}

export type FileUploadReturn = FileUploadState & FileUploadActions;
