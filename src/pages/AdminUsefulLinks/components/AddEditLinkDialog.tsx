
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UsefulLink } from '@/pages/UsefulLinks/types';
import UsefulLinkForm, { UsefulLinkFormValues } from './UsefulLinkForm';
import { useUsefulLinks } from '../hooks/useUsefulLinks';

interface AddEditLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'add' | 'edit';
  initialData?: UsefulLink;
  onSuccess: () => void;
}

const AddEditLinkDialog: React.FC<AddEditLinkDialogProps> = ({ 
  open, 
  onOpenChange, 
  mode, 
  initialData, 
  onSuccess 
}) => {
  const { t } = useLanguage();
  const { addLink, updateLink, isSubmitting } = useUsefulLinks();
  
  const handleSubmit = async (values: UsefulLinkFormValues) => {
    let success = false;
    
    if (mode === 'add') {
      success = await addLink(values);
    } else if (initialData?.id) {
      success = await updateLink(initialData.id, values);
    }
    
    if (success) {
      onSuccess();
      onOpenChange(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Add New Link' : 'Edit Link'}
          </DialogTitle>
          <DialogDescription>
            Add a useful link that will be displayed on the Useful Links page.
          </DialogDescription>
        </DialogHeader>
        
        <UsefulLinkForm 
          initialData={initialData} 
          onSubmit={handleSubmit}
          submitButtonText={mode === 'add' ? 'Add Link' : 'Update Link'}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddEditLinkDialog;
