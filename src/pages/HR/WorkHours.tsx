
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const WorkHours: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">{t('nav.hr.work_hours')}</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('hr.work_hours.title')}</CardTitle>
          <CardDescription>{t('hr.work_hours.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t('page.under_construction')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkHours;
