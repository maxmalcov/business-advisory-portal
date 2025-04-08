
import { useFileUpload as useBaseFileUploadHook } from './fileUpload';
export type { 
  FileUploadOptions, 
  UploadConfig, 
  UploadedFile,
  FileUploadReturn
} from './fileUpload';

export const useBaseFileUpload = useBaseFileUploadHook;
