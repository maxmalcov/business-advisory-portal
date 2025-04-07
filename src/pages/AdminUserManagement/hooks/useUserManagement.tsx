
import { useState } from 'react';
import { useFetchUsers } from './useFetchUsers';
import { useUpdateUser } from './useUpdateUser';
import { useDeleteUser } from './useDeleteUser';
import { useAddUser } from './useAddUser';
import { useToggleUserStatus } from './useToggleUserStatus';
import { User } from './types';

export type { User } from './types';

export const useUserManagement = () => {
  // Get user fetching functionality
  const { 
    users, 
    isLoading, 
    searchQuery, 
    setSearchQuery,
    refreshUsers
  } = useFetchUsers();
  
  // Maintain a local copy of users for status toggling
  const [localUsers, setLocalUsers] = useState<User[]>([]);
  
  // Get user updating functionality
  const {
    editingUser,
    handleEditUser,
    handleUpdateUser,
    handleSaveUser,
    handleCancelEdit
  } = useUpdateUser(refreshUsers);
  
  // Get user deletion functionality
  const {
    showConfirmDelete,
    userToDelete,
    handleDeleteUser,
    confirmDeleteUser,
    setShowConfirmDelete
  } = useDeleteUser(refreshUsers);
  
  // Get user creation functionality
  const {
    isAddingUser,
    handleAddUser,
    handleCancelAddUser,
    handleSaveNewUser
  } = useAddUser(refreshUsers);
  
  // Get user status toggling functionality
  const { toggleUserStatus } = useToggleUserStatus(users, setLocalUsers);

  return {
    users,
    isLoading,
    searchQuery,
    setSearchQuery,
    editingUser,
    isAddingUser,
    showConfirmDelete,
    userToDelete,
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
  };
};
