
import React from 'react';
import { Briefcase, Eye, FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Employee } from '../../types/employee';
import { Card, CardContent } from '@/components/ui/card';

interface IdentificationSectionProps {
  employee: Employee;
}

const IdentificationSection: React.FC<IdentificationSectionProps> = ({ employee }) => {
  const hasIdentification = employee.dniTie || employee.idDocument;
  
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
                  <a
                    href={employee.idDocumentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2"
                  >
                    <Button variant="ghost" size="sm" className="h-6 p-1">
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span className="sr-only">View document</span>
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
    </div>
  );
};

export default IdentificationSection;
