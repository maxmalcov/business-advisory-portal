
import React from 'react';
import { Subscription } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SubscriptionForm from './SubscriptionForm';

type SubscriptionDialogProps = {
  isOpen: boolean;
  isEditMode: boolean;
  selectedSubscription: Subscription | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (subscription: Subscription) => void;
};

const SubscriptionDialog: React.FC<SubscriptionDialogProps> = ({
  isOpen,
  isEditMode,
  selectedSubscription,
  onOpenChange,
  onSubmit
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Subscription' : 'Add New Subscription'}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? 'Modify the subscription details below.' 
              : 'Fill in the details to add a new subscription.'}
          </DialogDescription>
        </DialogHeader>
        <SubscriptionForm 
          subscription={selectedSubscription} 
          onSubmit={onSubmit} 
          onCancel={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionDialog;
