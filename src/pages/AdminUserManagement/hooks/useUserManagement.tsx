import { useState, useEffect } from 'react';
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
    refreshUsers,
    setUsers,
  } = useFetchUsers();

  // Maintain a local copy of users for status toggling
  const [localUsers, setLocalUsers] = useState<User[]>([]);

  // When users change from the fetch hook, update our local state
  // But only do this once when users are first loaded or explicitly refreshed
  useEffect(() => {
    if (users.length > 0 && !localUsers.length) {
      setLocalUsers(users);
    }
  }, [users, localUsers.length]);
  // Get user updating functionality
  const {
    editingUser,
    handleEditUser,
    handleUpdateUser,
    handleSaveUser: saveUserToDb,
    handleCancelEdit,
  } = useUpdateUser(refreshUsers);

  // Custom save handler that updates the local state without a full refresh
  const handleSaveUser = async () => {
    if (!editingUser) return;

    // First save to the database
    await saveUserToDb();

    // Then update the user in our local state to avoid a full refresh
    setLocalUsers((prev) =>
      prev.map((user) => (user.id === editingUser.id ? editingUser : user)),
    );

    // Also update the main users array from the fetch hook
    // This prevents inconsistency if other components use this data
    setUsers((prev) =>
      prev.map((user) => (user.id === editingUser.id ? editingUser : user)),
    );
  };

  // Get user creation functionality
  const {
    isAddingUser,
    handleAddUser,
    handleCancelAddUser,
    handleSaveNewUser,
  } = useAddUser(refreshUsers);

  // Get user status toggling functionality
  const { toggleUserStatus } = useToggleUserStatus(users, setLocalUsers);

  // Get user deletion functionality
  const {
    showConfirmDelete,
    userToDelete,
    handleDeleteUser,
    confirmDeleteUser,
    setShowConfirmDelete,
  } = useDeleteUser(refreshUsers, handleCancelEdit);

  return {
    users: localUsers, // Use our local state for the UI
    isLoading,
    searchQuery,
    setSearchQuery,
    editingUser,
    isAddingUser,
    showConfirmDelete,
    userToDelete,
    handleEditUser,
    handleUpdateUser,
    handleSaveUser, // Use our custom save handler
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
