
import React from 'react';
import { Employee } from '../../types/employee';
import { User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {useLanguage} from "@/context/LanguageContext.tsx";

interface BasicInfoCardProps {
  employee: Employee;
}

const BasicInfoCard: React.FC<BasicInfoCardProps> = ({ employee }) => {
  const {t} = useLanguage()
  return (
    <Card className="overflow-hidden border border-border shadow-sm">
      <div className="bg-muted/30 px-6 py-3 border-b border-border">
        <h3 className="text-md font-medium flex items-center text-foreground">
          <User className="h-4 w-4 mr-2 text-primary" />
          {t('hr.index.employee.details.basic-info.title')}
        </h3>
      </div>
      <CardContent className="pt-4 bg-card">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t("hr.index.employee.details.basic-info.company")}</p>
            <p className="text-sm font-semibold text-foreground">{employee.companyName || '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t('hr.index.employee.details.basic-info.status')}</p>
            <p className="text-sm font-semibold text-foreground">{employee.status === 'active' ? t('hr.index.status.active') : t('hr.index.status.terminated')}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t('hr.index.employee.details.basic-info.position')}</p>
            <p className="text-sm font-semibold text-foreground">{employee.position || '-'}</p>
          </div>
          {employee.email && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('hr.index.employee.details.basic-info.email')}</p>
              <p className="text-sm font-semibold text-foreground">{employee.email}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoCard;
