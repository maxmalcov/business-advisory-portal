
import React, { useState } from 'react';
import { useUserManagement } from './hooks/useUserManagement';
import UserManagementHeader from './components/UserManagementHeader';
import UserSearchBar from './components/UserSearchBar';
import UserTable from './components/UserTable';
import UserEditDialog from './components/UserEditDialog';
import AddUserDialog from './components/AddUserDialog';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const AdminUserManagement: React.FC = () => {
  const {
    users,
    filteredUsers,
    searchQuery,
    selectedUser,
    isAddUserOpen,
    isUserEditOpen,
    setSearchQuery,
    setSelectedUser,
    setIsAddUserOpen,
    setIsUserEditOpen,
    handleAddUser,
    handleUpdateUser,
    handleDeleteUser,
    handleToggleUserStatus,
  } = useUserManagement();

  return (
    <div className="space-y-6">
      <UserManagementHeader onAddUser={() => setIsAddUserOpen(true)} />
      
      <UserSearchBar 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
      />
      
      <UserTable 
        users={filteredUsers} 
        onEditUser={(user) => {
          setSelectedUser(user);
          setIsUserEditOpen(true);
        }}
        onDeleteUser={handleDeleteUser}
        onToggleStatus={handleToggleUserStatus}
      />
      
      {/* Add User Dialog */}
      <AddUserDialog 
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onAddUser={handleAddUser}
      />
      
      {/* Edit User Dialog */}
      {selectedUser && (
        <Dialog open={isUserEditOpen} onOpenChange={setIsUserEditOpen}>
          <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-none">
            <UserEditDialog
              user={selectedUser}
              onUserChange={setSelectedUser}
              onSave={() => {
                handleUpdateUser(selectedUser);
                setIsUserEditOpen(false);
              }}
              onCancel={() => setIsUserEditOpen(false)}
              onDelete={handleDeleteUser}
              onToggleStatus={handleToggleUserStatus}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminUserManagement;
