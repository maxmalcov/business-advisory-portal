
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadDocumentToStorage } from '@/pages/HR/NewEmployee/components/DocumentUploader';

interface DocumentUploaderProps {
  onDocumentUploaded: (filePath: string) => void;
  isUploading: boolean;
  uploadProgress: number;
  setIsUploading: (isUploading: boolean) => void;
  setUploadProgress: (progress: number) => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onDocumentUploaded,
  isUploading,
  uploadProgress,
  setIsUploading,
  setUploadProgress
}) => {
  const { toast } = useToast();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const isValidType = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
    
    if (!isValidType) {
      toast({
        title: 'Invalid File Type',
        description: 'Only PDF, JPG and PNG files are accepted.',
        variant: 'destructive'
      });
      return;
    }
    
    if (file.size > 25 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'File size must be less than 25MB.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const filePath = await uploadDocumentToStorage(file, setUploadProgress);
      
      toast({
        title: 'Document Uploaded',
        description: 'The document has been successfully uploaded.',
      });
      
      // Update the document path in the form data
      onDocumentUploaded(filePath);
      
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: 'Upload Failed',
        description: 'Could not upload the document. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000); // Reset progress after a short delay
    }
  };

  const triggerFileUpload = () => {
    inputRef.current?.click();
  };

  return (
    <>
      <div className="flex items-center">
        <Input
          id="idDocumentUpload"
          name="idDocumentUpload"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="flex-1"
          disabled={isUploading}
          ref={inputRef}
        />
        <Button 
          type="button" 
          variant="outline" 
          className="ml-2"
          disabled={isUploading}
          onClick={triggerFileUpload}
        >
          <Upload className="h-4 w-4" />
        </Button>
      </div>
      
      {isUploading && (
        <div className="space-y-1">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-xs text-muted-foreground">Uploading: {Math.round(uploadProgress)}%</p>
        </div>
      )}
    </>
  );
};

export default DocumentUploader;
