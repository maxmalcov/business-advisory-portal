
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Reports: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">{t('nav.reports')}</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('reports.title')}</CardTitle>
          <CardDescription>{t('reports.description')}</CardDescription>
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

export default Reports;
