
import { useFetchUsers } from './useFetchUsers';
import { useFilterUsers } from './useFilterUsers';
import { useEditUser } from './useEditUser';
import { useDeleteUser } from './useDeleteUser';
import { useAddUser } from './useAddUser';
import { useUserStatus } from './useUserStatus';

export type { User } from './types';

export const useUserManagement = () => {
  const { users, setUsers, isLoading, fetchUsers } = useFetchUsers();
  const { filteredUsers, searchQuery, setSearchQuery } = useFilterUsers(users);
  const { editingUser, handleEditUser, handleUpdateUser, handleSaveUser, handleCancelEdit } = useEditUser({ users, setUsers });
  const { showConfirmDelete, userToDelete, setShowConfirmDelete, handleDeleteUser, confirmDeleteUser } = useDeleteUser({ users, setUsers });
  const { isAddingUser, handleAddUser, handleCancelAddUser, handleSaveNewUser } = useAddUser({ fetchUsers });
  const { toggleUserStatus } = useUserStatus({ users, setUsers });

  return {
    users: filteredUsers,
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
    fetchUsers,
  };
};
