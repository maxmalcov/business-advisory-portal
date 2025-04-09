
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useUsefulLinks } from '../hooks/useUsefulLinks';

interface DeleteLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  linkId: string;
  linkTitle: string;
  onSuccess: () => void;
}

const DeleteLinkDialog: React.FC<DeleteLinkDialogProps> = ({
  open,
  onOpenChange,
  linkId,
  linkTitle,
  onSuccess,
}) => {
  const { t } = useLanguage();
  const { deleteLink } = useUsefulLinks();

  const handleDelete = async () => {
    const success = await deleteLink(linkId);
    if (success) {
      onSuccess();
      onOpenChange(false); // Fixed: Only passing one argument
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Confirmation</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the link "{linkTitle}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteLinkDialog;
