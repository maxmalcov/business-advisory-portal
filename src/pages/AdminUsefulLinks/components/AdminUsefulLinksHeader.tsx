
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AddEditLinkDialog from './AddEditLinkDialog';

interface AdminUsefulLinksHeaderProps {
  refetch: () => Promise<any>;
}

const AdminUsefulLinksHeader: React.FC<AdminUsefulLinksHeaderProps> = ({ refetch }) => {
  const { t } = useLanguage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{t('admin.useful_links.title')}</h1>
        <p className="text-muted-foreground">
          {t('admin.useful_links.description')}
        </p>
      </div>
      <Button onClick={() => setIsDialogOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        {t('admin.useful_links.add_new')}
      </Button>
      
      <AddEditLinkDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        mode="add"
        onSuccess={() => {
          refetch();
          setIsDialogOpen(false);
        }}
      />
    </div>
  );
};

export default AdminUsefulLinksHeader;
