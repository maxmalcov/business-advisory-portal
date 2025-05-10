import React from 'react';
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
import { SubscriptionTool } from '@/types/subscriptions';
import { useLanguage } from '@/context/LanguageContext.tsx';

interface RequestAccessDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  selectedTool: SubscriptionTool | null;
}

const RequestAccessDialog: React.FC<RequestAccessDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  selectedTool,
}) => {
  const { t } = useLanguage();

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('subscriptions.dialog.confirm-submit.title')}
            {selectedTool?.name}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('subscriptions.dialog.confirm-submit.description')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {t('subscriptions.dialog.confirm-submit.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {t('subscriptions.dialog.confirm-submit.button')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RequestAccessDialog;
