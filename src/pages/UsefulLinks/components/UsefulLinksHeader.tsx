
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Link2 } from 'lucide-react';

const UsefulLinksHeader = () => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center gap-3">
        <Link2 className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">{t('useful-links.title')}</h1>
      </div>
      <p className="text-muted-foreground max-w-3xl">
          {t('useful-links.user.description')}
      </p>
    </div>
  );
};

export default UsefulLinksHeader;
