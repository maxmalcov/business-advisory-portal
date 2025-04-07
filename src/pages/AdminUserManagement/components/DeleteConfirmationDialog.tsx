
import React from 'react';
import { DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { User } from '../hooks/useUserManagement';

interface DeleteConfirmationDialogProps {
  userToDelete: User | null;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  userToDelete,
  onCancel,
  onConfirm
}) => {
  return (
    <DialogContent className="sm:max-w-md">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Confirm Deletion</h2>
        <p>Are you sure you want to delete user {userToDelete?.name}?</p>
        <p className="text-destructive">This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <Button 
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={onConfirm}
          >
            Delete
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default DeleteConfirmationDialog;
