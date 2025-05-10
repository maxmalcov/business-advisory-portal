import React from 'react';
import { Employee } from '../../types/employee';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { DocumentDisplay } from './components/DocumentDisplay';
import { useLanguage } from '@/context/LanguageContext.tsx';
import { supabase } from '@/integrations/supabase/client.ts';

interface IdentificationSectionProps {
  employee: Employee;
}

const IdentificationSection: React.FC<IdentificationSectionProps> = ({
  employee,
}) => {
  const { t } = useLanguage();

  return (
    <Card className="overflow-hidden border border-border shadow-sm">
      <div className="bg-muted/30 px-6 py-3 border-b border-border">
        <h3 className="text-md font-medium flex items-center text-foreground">
          <FileText className="h-4 w-4 mr-2 text-primary" />
          {t('hr.index.employee.details.id')}
        </h3>
      </div>
      <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-card">
        <div>
          <p className="text-sm font-medium text-muted-foreground">DNI/TIE</p>
          <p className="text-sm font-semibold text-foreground">
            {employee.dniTie || '-'}
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {t('hr.index.employee.details.id-document')}
          </p>
          {employee.idDocument ? (
            <DocumentDisplay documentUrl={employee.idDocument} />
          ) : (
            <p className="text-sm text-muted-foreground">
              {t('hr.index.employee.details.no-document')}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IdentificationSection;
