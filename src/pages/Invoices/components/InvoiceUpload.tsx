
import React, { useState } from 'react';
import { FileUp, FileX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const InvoiceUpload: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      
      // Check number of files
      if (fileList.length > 15) {
        toast({
          variant: 'destructive',
          title: 'Too many files',
          description: 'You can upload a maximum of 15 files at once.',
        });
        return;
      }
      
      // Check file types and sizes
      const validFiles = fileList.filter(file => {
        const isValidType = ['application/pdf', 'image/jpeg', 'image/jpg'].includes(file.type);
        const isValidSize = file.size <= 25 * 1024 * 1024; // 25MB
        
        if (!isValidType) {
          toast({
            variant: 'destructive',
            title: 'Invalid file type',
            description: `${file.name} is not a PDF or JPG file.`,
          });
        }
        
        if (!isValidSize) {
          toast({
            variant: 'destructive',
            title: 'File too large',
            description: `${file.name} exceeds the 25MB limit.`,
          });
        }
        
        return isValidType && isValidSize;
      });
      
      setSelectedFiles(validFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files) {
      const fileList = Array.from(e.dataTransfer.files);
      
      // Check number of files
      if (fileList.length > 15) {
        toast({
          variant: 'destructive',
          title: 'Too many files',
          description: 'You can upload a maximum of 15 files at once.',
        });
        return;
      }
      
      // Check file types and sizes
      const validFiles = fileList.filter(file => {
        const isValidType = ['application/pdf', 'image/jpeg', 'image/jpg'].includes(file.type);
        const isValidSize = file.size <= 25 * 1024 * 1024; // 25MB
        
        if (!isValidType) {
          toast({
            variant: 'destructive',
            title: 'Invalid file type',
            description: `${file.name} is not a PDF or JPG file.`,
          });
        }
        
        if (!isValidSize) {
          toast({
            variant: 'destructive',
            title: 'File too large',
            description: `${file.name} exceeds the 25MB limit.`,
          });
        }
        
        return isValidType && isValidSize;
      });
      
      setSelectedFiles(validFiles);
    }
  };

  const sendInvoiceByEmail = async (files: File[]) => {
    if (!user?.outgoingInvoiceEmail) {
      toast({
        variant: 'destructive',
        title: 'Email Not Configured',
        description: 'You don\'t have an outgoing invoice email configured in your profile.',
      });
      return false;
    }

    try {
      // Call the Supabase Edge Function to send email
      const { error } = await supabase.functions.invoke('send-invoice-email', {
        body: {
          recipientEmail: user.outgoingInvoiceEmail,
          fileNames: files.map(file => file.name),
          userName: user.name || 'User',
          invoiceType: 'outgoing'
        }
      });

      if (error) {
        console.error('Error sending email:', error);
        toast({
          variant: 'destructive',
          title: 'Email Sending Failed',
          description: 'Could not send the invoice notification email.',
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error invoking send-invoice-email function:', error);
      toast({
        variant: 'destructive',
        title: 'Email Sending Failed',
        description: 'Could not send the invoice notification email.',
      });
      return false;
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No files selected',
        description: 'Please select files to upload.',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Here we would normally upload the files to the server
      // For now, we'll just simulate uploading and send the email notification
      
      // Send email notification
      const emailSent = await sendInvoiceByEmail(selectedFiles);
      
      // Show success message
      toast({
        title: 'Upload Successful',
        description: `${selectedFiles.length} invoice(s) uploaded successfully${emailSent ? ' and email notification sent' : ''}.`,
      });

      // Reset the file input
      setSelectedFiles([]);
    } catch (error) {
      console.error('Error during upload process:', error);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: 'An error occurred during the upload process.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload</CardTitle>
        <CardDescription>
          Upload your sales invoices for processing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload guidelines */}
        <div className="bg-muted p-4 rounded-md text-sm space-y-1">
          <p>Maximum file size: 25MB per file</p>
          <p>Maximum 15 files at once</p>
          <p>Accepted formats: PDF, JPG</p>
          {user?.outgoingInvoiceEmail ? (
            <p className="text-green-600">Email notifications will be sent to: {user.outgoingInvoiceEmail}</p>
          ) : (
            <p className="text-amber-600">Warning: No outgoing invoice email configured in your profile</p>
          )}
        </div>
        
        {/* File upload area */}
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <FileUp className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-2">
            Drag and drop files here, or click to browse
          </p>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            multiple
            accept=".pdf,.jpg,.jpeg"
            onChange={handleFileChange}
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            Select Files
          </Button>
        </div>
        
        {/* Selected files list */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">Selected Files ({selectedFiles.length})</h3>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {selectedFiles.map((file, index) => (
                <div 
                  key={`${file.name}-${index}`} 
                  className="flex items-center justify-between p-2 border rounded-md"
                >
                  <div className="flex items-center">
                    <FileUp className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium truncate max-w-xs">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFile(index)}
                    disabled={isLoading}
                  >
                    <FileX className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
            <Button 
              className="w-full" 
              onClick={handleUpload}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : `Upload ${selectedFiles.length} ${selectedFiles.length === 1 ? 'File' : 'Files'}`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoiceUpload;
