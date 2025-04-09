
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const UsefulLinksHeader = () => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold tracking-tight">{t('useful_links.title')}</h1>
      <p className="text-muted-foreground">
        {t('useful_links.description')}
      </p>
    </div>
  );
};

export default UsefulLinksHeader;
