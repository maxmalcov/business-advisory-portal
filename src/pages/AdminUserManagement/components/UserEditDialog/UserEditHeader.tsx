
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import UserEditButtons from './UserEditButtons';

interface UserEditHeaderProps {
  isEditMode: boolean;
  onToggleEditMode: () => void;
}

const UserEditHeader: React.FC<UserEditHeaderProps> = ({ isEditMode, onToggleEditMode }) => {
  return (
    <DialogHeader className="px-6 pt-4 pb-2 flex flex-row items-center justify-between">
      <div>
        <DialogTitle className="text-xl">{isEditMode ? 'Edit User' : 'User Details'}</DialogTitle>
        <DialogDescription className="mt-1">
          {isEditMode ? 'Modify user information and settings' : 'View user information and settings'}
        </DialogDescription>
      </div>
      <UserEditButtons isEditMode={isEditMode} onToggleEditMode={onToggleEditMode} />
    </DialogHeader>
  );
};

export default UserEditHeader;
