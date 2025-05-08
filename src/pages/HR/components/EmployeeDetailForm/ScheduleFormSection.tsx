
import React from 'react';
import { Employee } from '../../types/employee';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';
import {useLanguage} from "@/context/LanguageContext.tsx";

interface ScheduleFormSectionProps {
  formData: Employee;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const ScheduleFormSection: React.FC<ScheduleFormSectionProps> = ({
  formData,
  handleInputChange,
}) => {
  const {t} = useLanguage()
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-500">{t('hr.index.employee.detail-from.schedule')}</h3>
      
      <Card>
        <CardContent className="pt-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <Label htmlFor="weeklySchedule" className="text-base">{t('hr.index.employee.detail-from.weekly')}</Label>
              <div className="flex items-center text-gray-500 text-xs">
                <Info className="h-3.5 w-3.5 mr-1" />
                <span>{t('hr.index.employee.detail-from.weekly.span')}</span>
              </div>
            </div>
            
            <Textarea
              id="weeklySchedule"
              name="weeklySchedule"
              value={formData.weeklySchedule || ''}
              onChange={handleInputChange}
              placeholder={t('hr.index.employee.detail-from.schedule.placeholder')}
              rows={4}
              className="resize-none"
            />
            
            <div className="text-xs text-gray-500 mt-1">
              <p>{t('hr.index.employee.detail-from.schedule.examples')}</p>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li>{t('hr.index.employee.detail-from.schedule.examples.1')}</li>
                <li>{t('hr.index.employee.detail-from.schedule.examples.2')}</li>
                <li>{t('hr.index.employee.detail-from.schedule.examples.3')}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleFormSection;
