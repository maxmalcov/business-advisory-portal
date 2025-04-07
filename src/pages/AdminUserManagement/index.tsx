
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogTrigger
} from '@/components/ui/dialog';

// Import the components
import UserManagementHeader from './components/UserManagementHeader';
import UserSearchBar from './components/UserSearchBar';
import UserTable from './components/UserTable';
import UserEditDialog from './components/UserEditDialog';
import AddUserDialog from './components/AddUserDialog';
import DeleteConfirmationDialog from './components/DeleteConfirmationDialog';
import { useUserManagement } from './hooks/useUserManagement';

const AdminUserManagement: React.FC = () => {
  const { t } = useLanguage();
  const {
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
    fetchUsers,
  } = useUserManagement();

  return (
    <div className="space-y-6">
      <UserManagementHeader />
      
      <UserSearchBar 
        searchQuery={searchQuery} 
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        onAddUser={handleAddUser}
      />

      <Card>
        <CardContent className="p-0">
          <UserTable 
            users={users} 
            isLoading={isLoading}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
            onToggleStatus={toggleUserStatus}
            onRefresh={fetchUsers}
          />
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={(open) => {
        if (!open) handleCancelEdit();
      }}>
        {editingUser && (
          <UserEditDialog
            user={editingUser}
            onUserChange={handleUpdateUser}
            onSave={handleSaveUser}
            onCancel={handleCancelEdit}
          />
        )}
      </Dialog>

      {/* Add User Dialog */}
      <Dialog 
        open={isAddingUser} 
        onOpenChange={(open) => {
          if (!open) handleCancelAddUser();
        }}
      >
        <AddUserDialog 
          onSave={handleSaveNewUser}
          onCancel={handleCancelAddUser}
        />
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={showConfirmDelete} 
        onOpenChange={(open) => {
          setShowConfirmDelete(open);
        }}
      >
        <DeleteConfirmationDialog 
          userToDelete={userToDelete}
          onCancel={() => setShowConfirmDelete(false)}
          onConfirm={confirmDeleteUser}
        />
      </Dialog>
    </div>
  );
};

export default AdminUserManagement;
