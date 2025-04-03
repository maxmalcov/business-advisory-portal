
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/language';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUp, FileX, Check, AlertCircle, Clock, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

interface Invoice {
  id: string;
  fileName: string;
  uploadDate: string;
  status: 'processed' | 'pending' | 'rejected';
  size: string;
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    fileName: 'Invoice_2023_001.pdf',
    uploadDate: '2023-10-15',
    status: 'processed',
    size: '1.2 MB',
  },
  {
    id: '2',
    fileName: 'Invoice_2023_002.pdf',
    uploadDate: '2023-10-20',
    status: 'processed',
    size: '0.8 MB',
  },
  {
    id: '3',
    fileName: 'Invoice_2023_003.pdf',
    uploadDate: '2023-11-01',
    status: 'pending',
    size: '1.5 MB',
  },
  {
    id: '4',
    fileName: 'Invoice_2023_004.jpg',
    uploadDate: '2023-11-05',
    status: 'rejected',
    size: '2.1 MB',
  },
  {
    id: '5',
    fileName: 'Invoice_2023_005.pdf',
    uploadDate: '2023-11-10',
    status: 'pending',
    size: '0.9 MB',
  },
];

const Invoices: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

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

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No files selected',
        description: 'Please select files to upload.',
      });
      return;
    }

    // Here we would normally upload the files to the server
    // For now, we'll just show a success message
    toast({
      title: 'Upload Successful',
      description: `${selectedFiles.length} invoice(s) uploaded successfully.`,
    });

    // Reset the file input
    setSelectedFiles([]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  // Filter invoices based on search query
  const filteredInvoices = mockInvoices.filter(invoice => 
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
        <h1 className="text-2xl font-bold">{t('invoices.title')}</h1>
        <Link to="/invoices/create">
          <Button>
            <FileUp className="mr-2 h-4 w-4" />
            {t('invoices.upload')}
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="upload">{t('invoices.upload')}</TabsTrigger>
          <TabsTrigger value="history">{t('invoices.history')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>{t('invoices.upload')}</CardTitle>
              <CardDescription>
                Upload your sales invoices for processing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload guidelines */}
              <div className="bg-muted p-4 rounded-md text-sm space-y-1">
                <p>{t('invoices.max_size')}</p>
                <p>{t('invoices.max_files')}</p>
                <p>{t('invoices.allowed_types')}</p>
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
                  >
                    Upload {selectedFiles.length} {selectedFiles.length === 1 ? 'File' : 'Files'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>{t('invoices.history')}</CardTitle>
              <CardDescription>
                View your previously uploaded invoices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
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
                          <FileUp className="h-4 w-4 mr-2 text-muted-foreground" />
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
                      No invoices found matching your search.
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

export default Invoices;
