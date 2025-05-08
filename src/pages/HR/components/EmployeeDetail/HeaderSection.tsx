
import React from 'react';
import { Employee } from '../../types/employee';
import { CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {useLanguage} from "@/context/LanguageContext.tsx";

interface HeaderSectionProps {
  employee: Employee;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ employee }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const {t} = useLanguage()

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-border">
          <AvatarFallback className="bg-primary/10 text-primary text-xl">
            {getInitials(employee.fullName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-bold text-foreground">{employee.fullName}</h2>
          <p className="text-muted-foreground">{employee.position}</p>
        </div>
      </div>
      {employee.status === 'active' ? (
        <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-4 py-2 rounded-md flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          <span className="font-medium">{t('hr.index.status.active')}</span>
        </div>
      ) : (
        <Badge variant="destructive">{t('hr.index.status.terminated')}</Badge>
      )}
    </div>
  );
};

export default HeaderSection;
