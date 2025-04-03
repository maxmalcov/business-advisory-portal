
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';

// Import the components
import UserManagementHeader from './components/UserManagementHeader';
import UserSearchBar from './components/UserSearchBar';
import UserTable from './components/UserTable';
import UserDialogs from './components/UserDialogs';
import { useUserManagement } from './hooks/useUserManagement';

const AdminUserManagement: React.FC = () => {
  const { t } = useLanguage();
  const {
    users,
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
    setIsAddingUser,
  } = useUserManagement();

  console.log("AdminUserManagement: Rendering with isAddingUser:", isAddingUser);

  return (
    <div className="space-y-6">
      <UserManagementHeader />
      
      <UserSearchBar 
        searchQuery={searchQuery} 
        onSearchChange={handleSearch}
        onAddUser={handleAddUser}
      />

      <Card>
        <CardContent className="p-0">
          <UserTable 
            users={users} 
            onEditUser={handleEditUser}
          />
        </CardContent>
      </Card>

      <UserDialogs 
        editingUser={editingUser}
        isAddingUser={isAddingUser}
        onUserChange={handleUpdateUser}
        onSaveUser={handleSaveUser}
        onCancelEdit={handleCancelEdit}
        onSaveNewUser={handleSaveNewUser}
        onCancelAddUser={handleCancelAddUser}
        setIsAddingUser={setIsAddingUser}
        setEditingUser={(user) => handleUpdateUser(user)}
      />
    </div>
  );
};

export default AdminUserManagement;
