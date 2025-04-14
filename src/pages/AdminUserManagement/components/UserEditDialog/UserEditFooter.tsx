
import React from 'react';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Save, Power, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogContent, AlertDialogTrigger, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';
import type { User } from '../../hooks/types';

interface UserEditFooterProps {
  user: User;
  isEditMode: boolean;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (user: User) => void;
  onToggleStatus: (user: User) => void;
}

const UserEditFooter: React.FC<UserEditFooterProps> = ({
  user,
  isEditMode,
  onSave,
  onCancel,
  onDelete,
  onToggleStatus
}) => {
  return (
    <DialogFooter className="px-6 py-3 border-t bg-muted/20">
      <div className="flex items-center justify-between w-full">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="border-orange-400 text-orange-500 hover:bg-orange-50 hover:text-orange-600"
            onClick={() => onToggleStatus(user)}
            size="sm"
          >
            <Power className="h-4 w-4 mr-2" />
            {user.isActive ? "Deactivate User" : "Activate User"}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete User
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the user
                  {user && ` "${user.name}"`} and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(user)}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="flex gap-2">
          <DialogClose asChild>
            <Button variant="outline" onClick={onCancel} size="sm">Close</Button>
          </DialogClose>
          {isEditMode && (
            <Button onClick={onSave} size="sm">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          )}
        </div>
      </div>
    </DialogFooter>
  );
};

export default UserEditFooter;
