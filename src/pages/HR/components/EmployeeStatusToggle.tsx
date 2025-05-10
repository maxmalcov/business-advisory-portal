import React from 'react';
import { Button } from '@/components/ui/button';
import { User, UserMinus, Users } from 'lucide-react';
import { EmployeeStatus } from '../types/employee';
import { useIsSmallScreen } from '@/hooks/use-mobile';
import { useLanguage } from '@/context/LanguageContext.tsx';

interface EmployeeStatusToggleProps {
  value: EmployeeStatus | 'all';
  onChange: (value: EmployeeStatus | 'all') => void;
}

const EmployeeStatusToggle: React.FC<EmployeeStatusToggleProps> = ({
  value,
  onChange,
}) => {
  const isSmallScreen = useIsSmallScreen();
  const { t } = useLanguage();

  return (
    <div
      className={`flex ${isSmallScreen ? 'flex-col w-full gap-3' : 'items-center gap-2'}`}
    >
      <Button
        variant="ghost"
        size="sm"
        className={`flex items-center gap-2 ${value === 'all' ? 'bg-accent text-accent-foreground' : ''} ${isSmallScreen ? 'w-full justify-start pl-4' : ''}`}
        onClick={() => onChange('all')}
      >
        <Users className="h-4 w-4" />
        <span>{t('hr.index.table.all-employees')}</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`flex items-center gap-2 ${value === 'active' ? 'bg-accent text-accent-foreground' : ''} ${isSmallScreen ? 'w-full justify-start pl-4' : ''}`}
        onClick={() => onChange('active')}
      >
        <User className="h-4 w-4" />
        <span>{t('hr.index.table.active-employees')}</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`flex items-center gap-2 ${value === 'terminated' ? 'bg-accent text-accent-foreground' : ''} ${isSmallScreen ? 'w-full justify-start pl-4' : ''}`}
        onClick={() => onChange('terminated')}
      >
        <UserMinus className="h-4 w-4" />
        <span>{t('hr.index.table.terminated-employees')}</span>
      </Button>
    </div>
  );
};

export default EmployeeStatusToggle;
