
import React from 'react';
import { Eye, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getDocumentUrl } from '../utils/documentUtils';

interface DocumentActionsProps {
  documentPath: string;
  filename: string;
}

const DocumentActions: React.FC<DocumentActionsProps> = ({ documentPath, filename }) => {
  const { toast } = useToast();
  
  const handleViewDocument = async () => {
    try {
      console.log('Attempting to view document:', documentPath);
      const signedUrl = await getDocumentUrl(documentPath);
      console.log('Successfully generated signed URL:', signedUrl);
      window.open(signedUrl, '_blank');
    } catch (error) {
      console.error('Error viewing document:', error);
      toast({
        title: 'Error',
        description: 'Could not retrieve the document. Please try again.',
        variant: 'destructive'
      });
    }
  };
  
  const handleDownloadDocument = async () => {
    try {
      console.log('Attempting to download document:', documentPath);
      const signedUrl = await getDocumentUrl(documentPath);
      console.log('Successfully generated signed URL for download:', signedUrl);
      
      // Create an anchor element and trigger download
      const link = document.createElement('a');
      link.href = signedUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: 'Error',
        description: 'Could not download the document. Please try again.',
        variant: 'destructive'
      });
    }
  };
  
  return (
    <div className="flex space-x-1 ml-2">
      <Button variant="ghost" size="sm" className="h-6 p-1" onClick={handleViewDocument}>
        <Eye className="h-3.5 w-3.5" />
        <span className="sr-only">View document</span>
      </Button>
      <Button variant="ghost" size="sm" className="h-6 p-1" onClick={handleDownloadDocument}>
        <Download className="h-3.5 w-3.5" />
        <span className="sr-only">Download document</span>
      </Button>
    </div>
  );
};

export default DocumentActions;
