import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
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
import { mockUsers } from './mockData';

// Define the User type
interface User {
  id: string;
  name: string;
  email: string;
  companyName?: string;
  userType: string;
  incomingInvoiceEmail?: string;
  outgoingInvoiceEmail?: string;
  iframeUrls?: string[];
}

const AdminUserManagement: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleEditUser = (user: User) => {
    setEditingUser({...user});
  };

  const handleUpdateUser = (updatedUser: User) => {
    setEditingUser(updatedUser);
  };

  const handleSaveUser = () => {
    if (!editingUser) return;
    
    setUsers(users.map(user => 
      user.id === editingUser.id ? editingUser : user
    ));
    
    toast({
      title: "User Updated",
      description: `${editingUser.name}'s details have been updated successfully.`,
    });
    
    setEditingUser(null);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  // Completely recreated add user handlers
  const handleAddUser = () => {
    console.log("AdminUserManagement: handleAddUser called");
    setIsAddingUser(true);
  };

  const handleCancelAddUser = () => {
    console.log("AdminUserManagement: handleCancelAddUser called");
    setIsAddingUser(false);
  };

  const handleSaveNewUser = (newUser: Omit<User, 'id'>) => {
    // Generate a simple ID (in a real app, this would come from the backend)
    const id = `${users.length + 1}`;
    
    const userToAdd: User = {
      id,
      ...newUser
    };
    
    setUsers([...users, userToAdd]);
    
    toast({
      title: "User Created",
      description: `${newUser.name} has been added successfully.`,
    });
    
    setIsAddingUser(false);
  };

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
            users={filteredUsers} 
            onEditUser={handleEditUser}
          />
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={(open) => {
        if (!open) setEditingUser(null);
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

      {/* Fixed Add User Dialog - completely recreated */}
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
              onSave={handleSaveNewUser}
              onCancel={handleCancelAddUser}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUserManagement;
