import React, { useState } from 'react';
import { Employee } from '../../types/employee';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

interface IdentificationFormSectionProps {
  formData: Employee;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  updateDocument?: (documentPath: string) => void;
}

const IdentificationFormSection: React.FC<IdentificationFormSectionProps> = ({
  formData,
  handleInputChange,
  updateDocument
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

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
      // Create a unique file path with timestamp
      const timestamp = new Date().getTime();
      // Sanitize filename: keep only alphanumeric characters, hyphens, and underscores
      const sanitizedName = file.name
        .replace(/[^\w.-]/g, '-')
        .replace(/\s+/g, '-')
        .toLowerCase();
      
      const filePath = `${timestamp}_${sanitizedName}`;
      
      // Set initial progress for better UX
      setUploadProgress(10);
      
      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from('employee_documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      // Simulate progress since onUploadProgress is not available
      setUploadProgress(50);
      
      // Add a small delay to simulate progress
      await new Promise(resolve => setTimeout(resolve, 300));
      setUploadProgress(80);
      
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadProgress(100);
      
      if (error) throw error;
      
      toast({
        title: 'Document Uploaded',
        description: 'The document has been successfully uploaded.',
      });
      
      // Update the document path in the form data
      if (updateDocument) {
        updateDocument(filePath);
      }
      
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

  const handleViewDocument = async () => {
    if (!formData.idDocument) {
      toast({
        title: 'No Document',
        description: 'There is no document available to view.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      // Get a temporary URL for the document
      const { data, error } = await supabase.storage
        .from('employee_documents')
        .createSignedUrl(formData.idDocument, 60); // URL valid for 60 seconds
      
      if (error) throw error;
      
      if (data && data.signedUrl) {
        // Open the document in a new tab
        window.open(data.signedUrl, '_blank');
      } else {
        throw new Error('Could not generate document URL');
      }
    } catch (error) {
      console.error('Error viewing document:', error);
      toast({
        title: 'Error',
        description: 'Could not retrieve the document. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-500">Identification</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dniTie">DNI/TIE</Label>
          <Input
            id="dniTie"
            name="dniTie"
            value={formData.dniTie || ''}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="idDocument">ID Document</Label>
          <div className="flex flex-col gap-2">
            <div className="flex">
              <Input
                value={formData.idDocument ? formData.idDocument.split('/').pop() || formData.idDocument : ''}
                disabled
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                className="ml-2"
                onClick={handleViewDocument}
                disabled={!formData.idDocument}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center">
              <Input
                id="idDocumentUpload"
                name="idDocumentUpload"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="flex-1"
                disabled={isUploading}
              />
              <Button 
                type="button" 
                variant="outline" 
                className="ml-2"
                disabled={isUploading}
                onClick={() => document.getElementById('idDocumentUpload')?.click()}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentificationFormSection;
