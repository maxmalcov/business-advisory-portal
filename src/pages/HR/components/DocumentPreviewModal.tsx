
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, FileText, X, ZoomIn, ZoomOut } from 'lucide-react';

interface DocumentPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentUrl: string | null;
  fileName: string | null;
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  open,
  onOpenChange,
  documentUrl,
  fileName
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'pdf' | 'unknown'>('unknown');
  const [zoomLevel, setZoomLevel] = useState(100);
  
  useEffect(() => {
    if (!documentUrl) return;
    
    setIsLoading(true);
    setError(null);
    
    // Determine file type based on URL extension
    const fileExtension = documentUrl.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension || '')) {
      setFileType('image');
    } else if (fileExtension === 'pdf') {
      setFileType('pdf');
    } else {
      setFileType('unknown');
    }
    
    // Pre-load the image if it's an image type
    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension || '')) {
      const img = new Image();
      img.onload = () => {
        setIsLoading(false);
      };
      img.onerror = () => {
        setError('Failed to load image');
        setIsLoading(false);
      };
      img.src = documentUrl;
    } else {
      setIsLoading(false);
    }
  }, [documentUrl]);
  
  const handleDownload = () => {
    if (!documentUrl) return;
    
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = documentUrl;
    link.download = fileName || 'document';
    link.target = '_blank';
    link.click();
  };
  
  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };
  
  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="truncate max-w-[80%]">
            {fileName || 'Document Preview'}
          </DialogTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownload}
              disabled={!documentUrl}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            {fileType === 'image' && (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={zoomOut}
                  disabled={zoomLevel <= 50}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-xs w-12 text-center">{zoomLevel}%</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={zoomIn}
                  disabled={zoomLevel >= 200}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto mt-4 bg-gray-50 rounded-md p-2 flex items-center justify-center">
          {isLoading ? (
            <div className="animate-pulse bg-gray-200 w-full h-full min-h-[300px] flex items-center justify-center">
              <p className="text-gray-500">Loading document...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-4">
              <p>{error}</p>
            </div>
          ) : !documentUrl ? (
            <div className="text-center text-gray-500 p-4">
              <p>No document available</p>
            </div>
          ) : fileType === 'image' ? (
            <div className="relative w-full overflow-auto text-center" style={{ maxHeight: 'calc(90vh - 150px)' }}>
              <img 
                src={documentUrl} 
                alt={fileName || 'Document preview'} 
                className="max-w-full inline-block"
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center' }}
              />
            </div>
          ) : fileType === 'pdf' ? (
            <iframe 
              src={documentUrl} 
              className="w-full h-full min-h-[500px]" 
              title={fileName || 'PDF Document'}
            />
          ) : (
            <div className="text-center p-8 flex flex-col items-center">
              <FileText className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-500 mb-2">Preview not available — download file instead</p>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewModal;
