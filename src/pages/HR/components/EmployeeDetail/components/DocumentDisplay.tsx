
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Download } from 'lucide-react';

interface DocumentDisplayProps {
  documentUrl: string;
}

const DocumentDisplay: React.FC<DocumentDisplayProps> = ({ documentUrl }) => {
  const fileName = documentUrl.split('/').pop() || 'Document';
  
  // Function to handle document preview
  const handlePreview = () => {
    window.open(documentUrl, '_blank');
  };
  
  // Function to handle document download
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = documentUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center text-sm text-foreground">
        <span className="truncate max-w-[200px]">{fileName}</span>
      </div>
      <div className="flex space-x-2">
        <Button 
          size="sm" 
          variant="outline"
          className="h-8 px-2 text-xs"
          onClick={handlePreview}
        >
          <Eye className="h-3.5 w-3.5 mr-1" />
          View
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          className="h-8 px-2 text-xs"
          onClick={handleDownload}
        >
          <Download className="h-3.5 w-3.5 mr-1" />
          Download
        </Button>
      </div>
    </div>
  );
};

export { DocumentDisplay };
