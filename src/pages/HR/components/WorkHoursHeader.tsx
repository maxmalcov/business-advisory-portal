
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface WorkHoursHeaderProps {
  isAddingNew: boolean;
  setIsAddingNew: (value: boolean) => void;
  submitToHR: () => void;
}

const WorkHoursHeader: React.FC<WorkHoursHeaderProps> = ({
  isAddingNew,
  setIsAddingNew,
  submitToHR
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex justify-between items-center">
      <div>
        <CardTitle>{t('hr.work_hours.title')}</CardTitle>
        <CardDescription>{t('hr.work_hours.description')}</CardDescription>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => setIsAddingNew(!isAddingNew)}>
          {isAddingNew ? 'Cancel' : <><Plus size={16} /> Add Record</>}
        </Button>
        <Button onClick={submitToHR} variant="outline">
          Send to HR
        </Button>
      </div>
    </div>
  );
};

export default WorkHoursHeader;
