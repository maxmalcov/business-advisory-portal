
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import UserEditDialog from './UserEditDialog';
import AddUserDialog from './AddUserDialog';
import { User } from '../hooks/useUserManagement';

interface UserDialogsProps {
  editingUser: User | null;
  isAddingUser: boolean;
  onUserChange: (user: User) => void;
  onSaveUser: () => void;
  onCancelEdit: () => void;
  onSaveNewUser: (newUser: Omit<User, 'id'>) => void;
  onCancelAddUser: () => void;
  setIsAddingUser: (isAdding: boolean) => void;
  setEditingUser: (user: User | null) => void;
}

const UserDialogs: React.FC<UserDialogsProps> = ({
  editingUser,
  isAddingUser,
  onUserChange,
  onSaveUser,
  onCancelEdit,
  onSaveNewUser,
  onCancelAddUser,
  setIsAddingUser,
  setEditingUser
}) => {
  return (
    <>
      {/* Edit User Dialog */}
      <Dialog 
        open={!!editingUser} 
        onOpenChange={(open) => {
          if (!open) setEditingUser(null);
        }}
      >
        {editingUser && (
          <DialogContent>
            <UserEditDialog
              user={editingUser}
              onUserChange={onUserChange}
              onSave={onSaveUser}
              onCancel={onCancelEdit}
            />
          </DialogContent>
        )}
      </Dialog>

      {/* Add User Dialog */}
      <Dialog 
        open={isAddingUser} 
        onOpenChange={(open) => {
          console.log("Add User Dialog onOpenChange:", open);
          setIsAddingUser(open);
        }}
      >
        <DialogContent>
          {isAddingUser && (
            <AddUserDialog 
              onSave={onSaveNewUser}
              onCancel={onCancelAddUser}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserDialogs;
