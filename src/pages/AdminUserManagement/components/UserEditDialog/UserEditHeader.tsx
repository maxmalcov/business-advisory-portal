import React from 'react';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { User } from '../../hooks/types';

interface UserEditHeaderProps {
  user: User;
  isEditMode: boolean;
}

const UserEditHeader: React.FC<UserEditHeaderProps> = ({
  user,
  isEditMode,
}) => {
  return (
    <DialogHeader className="px-6 pt-4 pb-2">
      <div className="flex-1 min-w-0">
        <DialogTitle className="text-xl truncate">
          {isEditMode ? 'Edit User' : 'User Details'}
        </DialogTitle>
        <DialogDescription className="mt-1 truncate">
          {isEditMode
            ? 'Modify user information and settings'
            : 'View user information and settings'}
        </DialogDescription>
      </div>
    </DialogHeader>
  );
};

export default UserEditHeader;
