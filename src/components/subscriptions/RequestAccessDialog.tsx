
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
} from "@/components/ui/alert-dialog";
import { SubscriptionTool } from '@/types/subscriptions';

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
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Request Access to {selectedTool?.name}</AlertDialogTitle>
          <AlertDialogDescription>
            This will send a notification to the administrator to review your request.
            You will be notified once your request has been processed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Submit Request
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RequestAccessDialog;
