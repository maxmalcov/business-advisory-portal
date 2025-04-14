
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Edit, Power, Trash2, X } from 'lucide-react';
import { AlertDialog, AlertDialogContent, AlertDialogTrigger, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { User } from '../../hooks/types';

interface UserEditHeaderProps {
  user: User;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onToggleStatus: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserEditHeader: React.FC<UserEditHeaderProps> = ({ 
  user, 
  isEditMode, 
  onToggleEditMode,
  onToggleStatus,
  onDelete
}) => {
  return (
    <DialogHeader className="px-6 pt-4 pb-2 flex flex-row items-center justify-between space-x-4">
      <div className="flex-1 min-w-0">
        <DialogTitle className="text-xl truncate">{isEditMode ? 'Edit User' : 'User Details'}</DialogTitle>
        <DialogDescription className="mt-1 truncate">
          {isEditMode ? 'Modify user information and settings' : 'View user information and settings'}
        </DialogDescription>
      </div>
      
      <div className="flex items-center gap-2 shrink-0">
        <TooltipProvider>
          {!isEditMode ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  onClick={onToggleEditMode}
                  size="sm"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit user information</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  onClick={onToggleEditMode}
                  size="sm"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Cancel editing</p>
              </TooltipContent>
            </Tooltip>
          )}
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                className="border-orange-400 text-orange-500 hover:bg-orange-50 hover:text-orange-600"
                onClick={() => onToggleStatus(user)}
                size="sm"
              >
                <Power className="h-4 w-4 mr-2" />
                {user.isActive ? "Deactivate" : "Activate"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{user.isActive ? "Deactivate this user" : "Activate this user"}</p>
            </TooltipContent>
          </Tooltip>
          
          <AlertDialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Permanently delete this user</p>
              </TooltipContent>
            </Tooltip>
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
        </TooltipProvider>
      </div>
    </DialogHeader>
  );
};

export default UserEditHeader;

