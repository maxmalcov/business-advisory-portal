
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { mockUsers } from '../mockData';

// Define the User type
export interface User {
  id: string;
  name: string;
  email: string;
  companyName?: string;
  userType: string;
  incomingInvoiceEmail?: string;
  outgoingInvoiceEmail?: string;
  iframeUrls?: string[];
}

export const useUserManagement = () => {
  const { toast } = useToast();
  
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.companyName?.toLowerCase() || '').includes(searchQuery.toLowerCase())
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

  return {
    users: filteredUsers,
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
    setEditingUser,
  };
};
