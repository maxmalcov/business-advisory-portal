
import React, { useState } from 'react';
import { Briefcase, Eye, FileText, ExternalLink, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Employee } from '../../types/employee';
import { Card, CardContent } from '@/components/ui/card';
import DocumentPreviewModal from '../DocumentPreviewModal';

interface IdentificationSectionProps {
  employee: Employee;
}

const IdentificationSection: React.FC<IdentificationSectionProps> = ({ employee }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const hasIdentification = employee.dniTie || employee.idDocument;
  
  const handlePreviewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setPreviewOpen(true);
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
              {employee.idDocumentUrl ? (
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm truncate max-w-[150px]">
                    {employee.idDocument || 'ID Document'}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 p-1 ml-2"
                    onClick={handlePreviewClick}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span className="sr-only">Preview document</span>
                  </Button>
                  <a
                    href={employee.idDocumentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1"
                  >
                    <Button variant="ghost" size="sm" className="h-6 p-1">
                      <Download className="h-3.5 w-3.5" />
                      <span className="sr-only">Download document</span>
                    </Button>
                  </a>
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
      
      <DocumentPreviewModal 
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        documentUrl={employee.idDocumentUrl}
        fileName={employee.idDocument}
      />
    </div>
  );
};

export default IdentificationSection;
