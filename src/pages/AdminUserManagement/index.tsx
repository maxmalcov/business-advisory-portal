
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';
import UserManagementHeader from './components/UserManagementHeader';
import UserSearchBar from './components/UserSearchBar';
import UserTable from './components/UserTable';
import UserStats from './components/UserStats';
import UserEditDialog from './components/UserEditDialog/index';
import AddUserDialog from './components/AddUserDialog/index';
import DeleteConfirmationDialog from './components/DeleteConfirmationDialog';
import { useUserManagement } from './hooks/useUserManagement';

const AdminUserManagement: React.FC = () => {
  const {
    users,
    isLoading,
    searchQuery,
    setSearchQuery,
    editingUser,
    isAddingUser,
    showConfirmDelete,
    userToDelete,
    userStats,
    handleEditUser,
    handleUpdateUser,
    handleSaveUser,
    handleDeleteUser,
    confirmDeleteUser,
    toggleUserStatus,
    handleCancelEdit,
    handleAddUser,
    handleCancelAddUser,
    handleSaveNewUser,
    setShowConfirmDelete,
  } = useUserManagement();

  return (
    <div className="container mx-auto py-6 space-y-8">
      <UserManagementHeader onAddUser={handleAddUser} />
      
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <UserStats userStats={userStats} />
        
        <div className="flex justify-between items-center mb-4">
          <UserSearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
        
        <div className="mt-6">
          <UserTable 
            users={users}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
            onToggleStatus={toggleUserStatus}
          />
        </div>
      </div>
      
      {/* User Details/Edit Dialog */}
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && handleCancelEdit()}>
        {editingUser && (
          <DialogContent className="max-w-5xl p-0 h-[90vh] flex flex-col mx-auto w-[95vw]">
            <UserEditDialog
              user={editingUser}
              onUserChange={handleUpdateUser}
              onSave={handleSaveUser}
              onCancel={handleCancelEdit}
              onDelete={handleDeleteUser}
              onToggleStatus={toggleUserStatus}
            />
          </DialogContent>
        )}
      </Dialog>
      
      {/* Add User Dialog */}
      <Dialog open={isAddingUser} onOpenChange={(open) => !open && handleCancelAddUser()}>
        {isAddingUser && (
          <DialogContent>
            <AddUserDialog 
              onSave={handleSaveNewUser}
              onCancel={handleCancelAddUser}
            />
          </DialogContent>
        )}
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              {userToDelete && ` "${userToDelete.name}"`} and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminUserManagement;
