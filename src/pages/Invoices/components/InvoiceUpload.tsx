
import React, { useState } from 'react';
import { FileUp, FileX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';

const InvoiceUpload: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [invoiceType, setInvoiceType] = useState<'incoming' | 'outgoing'>('incoming');
  const [isUploading, setIsUploading] = useState(false);
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

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No files selected',
        description: 'Please select files to upload.',
      });
      return;
    }

    // Determine email based on invoice type
    const targetEmail = invoiceType === 'incoming' 
      ? user?.incomingInvoiceEmail 
      : user?.outgoingInvoiceEmail;

    if (!targetEmail) {
      toast({
        variant: 'destructive',
        title: 'Email not configured',
        description: `You don't have a ${invoiceType} invoice email configured. Please update your profile.`,
      });
      return;
    }

    setIsUploading(true);

    try {
      // In a real implementation, we would upload these files to a server
      // For this demo, we'll simulate sending the files to the email
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulating upload delay

      toast({
        title: 'Upload Successful',
        description: `${selectedFiles.length} invoice(s) sent to ${targetEmail}`,
      });

      // Reset the file input
      setSelectedFiles([]);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: 'There was an error uploading your files.',
      });
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
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
          Upload your invoices for processing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Invoice Type Selection */}
        <div className="space-y-2">
          <h3 className="font-medium">Invoice Type</h3>
          <RadioGroup 
            value={invoiceType} 
            onValueChange={(value) => setInvoiceType(value as 'incoming' | 'outgoing')}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="incoming" id="incoming" />
              <Label htmlFor="incoming">Incoming Invoice</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="outgoing" id="outgoing" />
              <Label htmlFor="outgoing">Outgoing Invoice</Label>
            </div>
          </RadioGroup>
          {user && (
            <p className="text-sm text-muted-foreground mt-2">
              Selected email: {invoiceType === 'incoming' 
                ? (user.incomingInvoiceEmail || 'Not configured')
                : (user.outgoingInvoiceEmail || 'Not configured')
              }
            </p>
          )}
        </div>

        {/* Upload guidelines */}
        <div className="bg-muted p-4 rounded-md text-sm space-y-1">
          <p>Maximum file size: 25MB per file</p>
          <p>Maximum 15 files at once</p>
          <p>Accepted formats: PDF, JPG</p>
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
                  >
                    <FileX className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
            <Button 
              className="w-full" 
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading 
                ? 'Uploading...' 
                : `Upload ${selectedFiles.length} ${selectedFiles.length === 1 ? 'File' : 'Files'}`
              }
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoiceUpload;
