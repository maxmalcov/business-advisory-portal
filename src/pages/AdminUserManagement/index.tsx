
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

// Import the components
import UserManagementHeader from './components/UserManagementHeader';
import UserSearchBar from './components/UserSearchBar';
import UserTable from './components/UserTable';
import UserEditDialog from './components/UserEditDialog';
import AddUserDialog from './components/AddUserDialog';

// Import the hook
import { useUserManagement } from './hooks/useUserManagement';

const AdminUserManagement: React.FC = () => {
  const { t } = useLanguage();
  const {
    users,
    isLoading,
    searchQuery,
    editingUser,
    isAddingUser,
    handleSearch,
    handleEditUser,
    handleUpdateUser,
    handleSaveUser,
    handleCancelEdit,
    handleAddUser,
    handleCancelAddUser,
    handleSaveNewUser,
  } = useUserManagement();

  return (
    <div className="space-y-6">
      <UserManagementHeader />
      
      <UserSearchBar 
        searchQuery={searchQuery} 
        onSearchChange={handleSearch}
        onAddUser={handleAddUser}
      />

      {isLoading ? (
        <Card>
          <CardContent className="flex justify-center items-center h-40">
            <p>Loading users...</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <UserTable 
              users={users} 
              onEditUser={handleEditUser}
            />
          </CardContent>
        </Card>
      )}

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
        <DialogContent className="max-w-2xl">
          <AddUserDialog 
            onSave={handleSaveNewUser}
            onCancel={handleCancelAddUser}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUserManagement;
