
import React from 'react';
import { Briefcase } from 'lucide-react';
import { Employee } from '../../types/employee';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import DocumentDisplay from './components/DocumentDisplay';

interface IdentificationSectionProps {
  employee: Employee;
}

const IdentificationSection: React.FC<IdentificationSectionProps> = ({ employee }) => {
  const hasIdentification = employee.dniTie || employee.idDocument;
  const { toast } = useToast();

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
                <DocumentDisplay documentPath={employee.idDocument} />
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
