
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DocumentViewerProps {
  documentPath: string | undefined;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ documentPath }) => {
  const { toast } = useToast();

  const handleViewDocument = async () => {
    if (!documentPath) {
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
        .createSignedUrl(documentPath, 60); // URL valid for 60 seconds
      
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
    <Button 
      type="button" 
      variant="outline" 
      className="ml-2"
      onClick={handleViewDocument}
      disabled={!documentPath}
    >
      <Eye className="h-4 w-4" />
    </Button>
  );
};

export default DocumentViewer;
