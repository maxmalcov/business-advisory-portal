
import React, { useState } from 'react';
import { Employee } from '../../types/employee';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, FileX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface IdentificationFormSectionProps {
  formData: Employee;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileUpload?: (url: string, filename: string) => void;
}

const IdentificationFormSection: React.FC<IdentificationFormSectionProps> = ({
  formData,
  handleInputChange,
  handleFileUpload
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const allowedTypes = ['pdf', 'jpg', 'jpeg', 'png'];
    
    if (!allowedTypes.includes(fileExt?.toLowerCase() || '')) {
      setUploadError('Only PDF, JPG, and PNG files are allowed');
      toast({
        title: 'Invalid File Type',
        description: 'Only PDF, JPG, and PNG files are allowed',
        variant: 'destructive'
      });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setUploadError('File size must be less than 5MB');
      toast({
        title: 'File Too Large',
        description: 'File size must be less than 5MB',
        variant: 'destructive'
      });
      return;
    }
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      // Create a unique filename
      const timestamp = new Date().getTime();
      const filename = `${timestamp}-${file.name}`;
      const filePath = `${formData.id}/${filename}`;
      
      const { data, error } = await supabase.storage
        .from('employee-id-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) throw error;
      
      console.log('File uploaded successfully:', data);
      
      // Get public URL for the file
      const { data: urlData } = supabase.storage
        .from('employee-id-documents')
        .getPublicUrl(filePath);
      
      toast({
        title: 'Document Uploaded',
        description: 'ID document has been uploaded successfully'
      });
      
      // Pass the URL back to the parent component
      if (handleFileUpload) {
        handleFileUpload(urlData.publicUrl, filename);
      }
      
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError('Failed to upload file. Please try again.');
      toast({
        title: 'Upload Failed',
        description: 'There was a problem uploading the document',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
      // Clear the file input
      e.target.value = '';
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
          <div className="space-y-2">
            {formData.idDocumentUrl ? (
              <div className="flex items-center p-2 border rounded">
                <a 
                  href={formData.idDocumentUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline flex-1 truncate"
                >
                  {formData.idDocument || 'View Document'}
                </a>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No document uploaded</p>
            )}
            
            <div className="flex">
              <Input
                id="idDocument"
                name="idDocument"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                disabled={isUploading}
                className="flex-1"
              />
            </div>
            
            {isUploading && (
              <p className="text-xs text-blue-500">Uploading document...</p>
            )}
            
            {uploadError && (
              <p className="text-xs text-red-500">{uploadError}</p>
            )}
            
            <p className="text-xs text-gray-500">
              Upload a PDF, JPG, or PNG file (max 5MB)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentificationFormSection;
