import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Link2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext.tsx';

interface AdminUsefulLinksHeaderProps {
  onAddNew: () => void;
}

const AdminUsefulLinksHeader: React.FC<AdminUsefulLinksHeaderProps> = ({
  onAddNew,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Link2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t('useful-links.title')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('useful-links.description')}
            </p>
          </div>
        </div>
        <Button onClick={onAddNew}>
          <Plus className="h-4 w-4 mr-1" />
          {t('useful-links.add-link')}
        </Button>
      </div>
    </div>
  );
};

export default AdminUsefulLinksHeader;
