import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  onSuccess,
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
            {mode === 'add'
              ? t('useful-links.dialog.add-new.title')
              : t('useful-links.dialog.edit.title')}
          </DialogTitle>
          <DialogDescription>
            {t('useful-links.dialog.description')}
          </DialogDescription>
        </DialogHeader>

        <UsefulLinkForm
          initialData={initialData}
          onSubmit={handleSubmit}
          submitButtonText={
            mode === 'add'
              ? t('useful-links.dialog.add.title')
              : t('useful-links.dialog.update.title')
          }
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddEditLinkDialog;
