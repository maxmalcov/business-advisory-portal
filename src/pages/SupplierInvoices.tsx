import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileDown, Check, AlertCircle, Clock, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

interface SupplierInvoice {
  id: string;
  fileName: string;
  uploadDate: string;
  status: 'processed' | 'pending' | 'rejected';
  size: string;
}

const mockSupplierInvoices: SupplierInvoice[] = [
  {
    id: '1',
    fileName: 'Supplier_Invoice_2023_001.pdf',
    uploadDate: '2023-10-10',
    status: 'processed',
    size: '1.1 MB',
  },
  {
    id: '2',
    fileName: 'Supplier_Invoice_2023_002.pdf',
    uploadDate: '2023-10-25',
    status: 'processed',
    size: '0.7 MB',
  },
  {
    id: '3',
    fileName: 'Supplier_Invoice_2023_003.pdf',
    uploadDate: '2023-11-02',
    status: 'pending',
    size: '1.3 MB',
  },
  {
    id: '4',
    fileName: 'Supplier_Invoice_2023_004.jpg',
    uploadDate: '2023-11-08',
    status: 'rejected',
    size: '2.3 MB',
  },
];

const SupplierInvoices: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
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
    if (!user?.incomingInvoiceEmail) {
      toast({
        variant: 'destructive',
        title: 'Email Not Configured',
        description: 'You don\'t have an incoming invoice email configured in your profile.',
      });
      return false;
    }

    try {
      // Call the Supabase Edge Function to send email
      const { error } = await supabase.functions.invoke('send-invoice-email', {
        body: {
          recipientEmail: user.incomingInvoiceEmail,
          fileNames: files.map(file => file.name),
          userName: user.name || 'User',
          invoiceType: 'incoming'
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
        description: `${selectedFiles.length} supplier invoice(s) uploaded successfully${emailSent ? ' and email notification sent' : ''}.`,
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

  // Filter invoices based on search query
  const filteredInvoices = mockSupplierInvoices.filter(invoice => 
    invoice.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Status icon mapping
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'processed':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('nav.supplier_invoices')}</h1>
        <Button>
          <FileDown className="mr-2 h-4 w-4" />
          Upload Supplier Invoice
        </Button>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload Supplier Invoices</CardTitle>
              <CardDescription>
                Upload invoices received from your suppliers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload guidelines */}
              <div className="bg-muted p-4 rounded-md text-sm space-y-1">
                <p>Maximum file size: 25MB per file</p>
                <p>Maximum files: 15 files at once</p>
                <p>Allowed file types: PDF, JPG</p>
                {user?.incomingInvoiceEmail ? (
                  <p className="text-green-600">Email notifications will be sent to: {user.incomingInvoiceEmail}</p>
                ) : (
                  <p className="text-amber-600">Warning: No incoming invoice email configured in your profile</p>
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
                <FileDown className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
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
                  disabled={isLoading}
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
                          <FileDown className="h-5 w-5 mr-2 text-muted-foreground" />
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
                          &times;
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
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Invoices History</CardTitle>
              <CardDescription>
                View your previously uploaded supplier invoices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search supplier invoices..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Invoices list */}
              <div className="rounded-md border">
                <div className="bg-muted py-2 px-4 grid grid-cols-5 text-sm font-medium">
                  <div className="col-span-2">File Name</div>
                  <div>Date</div>
                  <div>Size</div>
                  <div>Status</div>
                </div>
                <div className="divide-y">
                  {filteredInvoices.length > 0 ? (
                    filteredInvoices.map((invoice) => (
                      <div 
                        key={invoice.id} 
                        className="grid grid-cols-5 py-3 px-4 items-center text-sm"
                      >
                        <div className="col-span-2 flex items-center">
                          <FileDown className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="truncate">{invoice.fileName}</span>
                        </div>
                        <div>{invoice.uploadDate}</div>
                        <div>{invoice.size}</div>
                        <div className="flex items-center">
                          {getStatusIcon(invoice.status)}
                          <span className="ml-2 capitalize">{invoice.status}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-muted-foreground">
                      No supplier invoices found matching your search.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupplierInvoices;
