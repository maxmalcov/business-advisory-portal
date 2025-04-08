
import React from 'react';
import { Briefcase, Eye, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Employee } from '../../types/employee';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface IdentificationSectionProps {
  employee: Employee;
}

const IdentificationSection: React.FC<IdentificationSectionProps> = ({ employee }) => {
  const hasIdentification = employee.dniTie || employee.idDocument;
  const { toast } = useToast();
  
  const handleViewDocument = async () => {
    if (!employee.idDocument) {
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
        .createSignedUrl(employee.idDocument, 60); // URL valid for 60 seconds
      
      if (error) {
        throw error;
      }
      
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
  
  const handleDownloadDocument = async () => {
    if (!employee.idDocument) {
      toast({
        title: 'No Document',
        description: 'There is no document available to download.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      // Get a temporary URL for the document
      const { data, error } = await supabase.storage
        .from('employee_documents')
        .createSignedUrl(employee.idDocument, 60); // URL valid for 60 seconds
      
      if (error) {
        throw error;
      }
      
      if (data && data.signedUrl) {
        // Create an anchor element and trigger download
        const link = document.createElement('a');
        link.href = data.signedUrl;
        link.download = employee.idDocument.split('/').pop() || 'employee-document';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        throw new Error('Could not generate document URL');
      }
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
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-500 flex items-center">
        <Briefcase className="h-4 w-4 mr-2" />
        Identification
      </h3>
      
      {hasIdentification ? (
        <Card>
          <CardContent className="pt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium mb-1">DNI/TIE</p>
              {employee.dniTie ? (
                <p className="text-sm">{employee.dniTie}</p>
              ) : (
                <p className="text-sm text-gray-500 italic">Not provided</p>
              )}
            </div>
            
            <div>
              <p className="text-sm font-medium mb-1">ID Document</p>
              {employee.idDocument ? (
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm truncate max-w-[150px]">
                    {employee.idDocument.split('/').pop() || employee.idDocument}
                  </span>
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
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No document uploaded</p>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="text-sm text-gray-500 italic">No identification information available</div>
      )}
    </div>
  );
};

export default IdentificationSection;
