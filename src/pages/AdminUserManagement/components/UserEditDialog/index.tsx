
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import UserEditHeader from './UserEditHeader';
import UserEditFooter from './UserEditFooter';
import UserEditTabs from './UserEditTabs';
import type { User } from '../../hooks/types';

interface UserEditDialogProps {
  user: User;
  onUserChange: (updatedUser: Partial<User>) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (user: User) => void;
  onToggleStatus: (user: User) => void;
}

const UserEditDialog: React.FC<UserEditDialogProps> = ({
  user,
  onUserChange,
  onSave,
  onCancel,
  onDelete,
  onToggleStatus
}) => {
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <div className="h-full flex flex-col">
      <DialogHeader className="relative px-6 pt-4 pb-2">
        <UserEditHeader user={user} isEditMode={isEditMode} />
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="absolute top-2 right-2 rounded-full h-8 w-8 p-0"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </Button>
      </DialogHeader>
      
      <div className="flex-1 overflow-y-auto">
        <UserEditTabs
          user={user}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          onUserChange={onUserChange}
        />
      </div>
      
      <UserEditFooter
        user={user}
        isEditMode={isEditMode}
        onToggleEditMode={() => setIsEditMode(!isEditMode)}
        onSave={onSave}
        onCancel={onCancel}
        onDelete={onDelete}
        onToggleStatus={onToggleStatus}
      />
    </div>
  );
};

export default UserEditDialog;
