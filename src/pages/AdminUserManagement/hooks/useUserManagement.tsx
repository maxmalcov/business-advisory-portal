
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface User {
  id: string;
  name: string;
  email: string;
  companyName?: string;
  userType: string;
  incomingInvoiceEmail?: string;
  outgoingInvoiceEmail?: string;
  iframeUrls?: string[];
  isActive?: boolean;
}

export const useUserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Fetch users from Supabase
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching users from Supabase...");
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) {
        throw error;
      }

      if (data) {
        console.log("Fetched profiles data:", data);
        // Transform the profiles data to match our User interface
        const transformedUsers: User[] = data.map(profile => ({
          id: profile.id,
          name: profile.name || '',
          email: profile.email || '',
          companyName: profile.companyname,
          userType: profile.usertype || 'client',
          incomingInvoiceEmail: profile.incominginvoiceemail,
          outgoingInvoiceEmail: profile.outgoinginvoiceemail,
          iframeUrls: [], // This may need to be added to the profiles table
          isActive: true // Assuming all users are active by default
        }));
        
        console.log("Transformed users:", transformedUsers);
        setUsers(transformedUsers);
      } else {
        console.log("No data returned from Supabase");
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load users'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.companyName?.toLowerCase().includes(searchQuery.toLowerCase() || '')
  );

  // Handle user edit
  const handleEditUser = (user: User) => {
    setEditingUser({...user});
  };

  // Handle user update
  const handleUpdateUser = (updatedUser: User) => {
    setEditingUser(updatedUser);
  };

  // Save edited user
  const handleSaveUser = async () => {
    if (!editingUser) return;
    
    try {
      console.log("Updating user in Supabase:", editingUser);
      // Update the user in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          name: editingUser.name,
          email: editingUser.email,
          usertype: editingUser.userType,
          companyname: editingUser.companyName,
          incominginvoiceemail: editingUser.incomingInvoiceEmail,
          outgoinginvoiceemail: editingUser.outgoingInvoiceEmail
          // Note: iframeUrls may need to be added to the profiles table
        })
        .eq('id', editingUser.id);

      if (error) throw error;

      // Update local state
      setUsers(users.map(user => 
        user.id === editingUser.id ? editingUser : user
      ));
      
      toast({
        title: "User Updated",
        description: `User ${editingUser.name} was successfully updated.`,
      });
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        variant: 'destructive',
        title: 'Update Error',
        description: 'An error occurred while updating the user.',
      });
    } finally {
      setEditingUser(null);
    }
  };

  // Handle user deletion
  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setShowConfirmDelete(true);
  };

  // Confirm user deletion
  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      // Delete the user from Supabase Auth
      const { error: authError } = await supabase.auth.admin.deleteUser(
        userToDelete.id
      );
      
      if (authError) {
        console.error('Error deleting user from Auth:', authError);
        // Try to delete from profiles table anyway
      }
      
      // Delete from profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userToDelete.id);

      if (profileError) throw profileError;

      // Update local state
      setUsers(users.filter(user => user.id !== userToDelete.id));
      
      toast({
        title: "User Deleted",
        description: `User ${userToDelete.name} was successfully deleted.`,
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        variant: 'destructive',
        title: 'Delete Error',
        description: 'An error occurred while deleting the user.',
      });
    } finally {
      setUserToDelete(null);
      setShowConfirmDelete(false);
    }
  };

  // Toggle user active status
  const toggleUserStatus = async (user: User) => {
    const updatedUser = { ...user, isActive: !user.isActive };
    
    try {
      // In a real implementation, you would update user status in Supabase
      // For this example, we're just updating the local state
      
      // Update local state
      setUsers(users.map(u => u.id === user.id ? updatedUser : u));
      
      toast({
        title: updatedUser.isActive ? "User Activated" : "User Deactivated",
        description: `${user.name}'s status was successfully changed.`,
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        variant: 'destructive',
        title: 'Status Update Error',
        description: 'An error occurred while changing the user status.',
      });
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  // Open add user dialog
  const handleAddUser = () => {
    setIsAddingUser(true);
  };

  // Cancel adding user
  const handleCancelAddUser = () => {
    setIsAddingUser(false);
  };

  // Save new user
  const handleSaveNewUser = async (newUser: Omit<User, 'id'>) => {
    try {
      console.log("Creating new user:", newUser);
      // Register the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: 'tempPassword123', // This should be provided by the user in a real app
        options: {
          data: {
            name: newUser.name,
            userType: newUser.userType,
            companyName: newUser.companyName,
            incomingInvoiceEmail: newUser.incomingInvoiceEmail,
            outgoingInvoiceEmail: newUser.outgoingInvoiceEmail
          }
        }
      });
      
      if (authError) throw authError;
      console.log("User created in Auth:", authData);

      // Fetch users again to update the list
      await fetchUsers();
      
      toast({
        title: "User Created",
        description: `${newUser.name} was successfully added.`,
      });
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        variant: 'destructive',
        title: 'Creation Error',
        description: 'An error occurred while creating the user.',
      });
    } finally {
      setIsAddingUser(false);
    }
  };

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
  };
};
