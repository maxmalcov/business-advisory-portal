
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
        <h1 className="text-3xl font-bold tracking-tight">Manage Useful Links</h1>
        <p className="text-muted-foreground">
          Add, edit or remove links that users can access from the Useful Links page.
        </p>
      </div>
      <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
        <Plus className="mr-2 h-4 w-4" />
        Add New Link
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
