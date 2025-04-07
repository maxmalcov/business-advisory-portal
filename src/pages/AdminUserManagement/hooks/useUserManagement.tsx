
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseAuthUser } from '@supabase/supabase-js';

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
  password?: string; // Added password property
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

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching users from Supabase...");
      // Fetch all user profiles from the profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*');

      if (profileError) {
        throw profileError;
      }

      // Also fetch the auth users to check their status
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('Error fetching auth users:', authError);
        // Continue with profile data even if auth fetch fails
      }

      if (profileData) {
        console.log("Fetched profiles data:", profileData);
        
        // Create a map of user IDs to their auth status
        const authStatusMap = new Map();
        if (authData && authData.users) {
          // Explicitly type the users as an array of SupabaseAuthUser
          const supabaseUsers = authData.users as SupabaseAuthUser[];
          supabaseUsers.forEach(user => {
            authStatusMap.set(user.id, !user.banned);
          });
        }
        
        const transformedUsers: User[] = profileData.map(profile => ({
          id: profile.id,
          name: profile.name || '',
          email: profile.email || '',
          companyName: profile.companyname,
          userType: profile.usertype || 'client',
          incomingInvoiceEmail: profile.incominginvoiceemail,
          outgoingInvoiceEmail: profile.outgoinginvoiceemail,
          iframeUrls: [],
          // Use auth status if available, otherwise default to true
          isActive: authStatusMap.has(profile.id) ? authStatusMap.get(profile.id) : true
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

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.companyName?.toLowerCase().includes(searchQuery.toLowerCase() || '')
  );

  const handleEditUser = (user: User) => {
    setEditingUser({...user});
  };

  const handleUpdateUser = (updatedUser: User) => {
    setEditingUser(updatedUser);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    
    try {
      console.log("Updating user in Supabase:", editingUser);
      const { error } = await supabase
        .from('profiles')
        .update({
          name: editingUser.name,
          email: editingUser.email,
          usertype: editingUser.userType,
          companyname: editingUser.companyName,
          incominginvoiceemail: editingUser.incomingInvoiceEmail,
          outgoinginvoiceemail: editingUser.outgoingInvoiceEmail
        })
        .eq('id', editingUser.id);

      if (error) throw error;

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

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setShowConfirmDelete(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      const { error: authError } = await supabase.auth.admin.deleteUser(
        userToDelete.id
      );
      
      if (authError) {
        console.error('Error deleting user from Auth:', authError);
      }
      
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userToDelete.id);

      if (profileError) throw profileError;

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

  const toggleUserStatus = async (user: User) => {
    const updatedUser = { ...user, isActive: !user.isActive };
    
    try {
      // For now, we're just updating the local state
      // In a real app, you might want to update user status in auth system
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

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleAddUser = () => {
    setIsAddingUser(true);
  };

  const handleCancelAddUser = () => {
    setIsAddingUser(false);
  };

  const handleSaveNewUser = async (newUser: Omit<User, 'id'>) => {
    try {
      console.log("Creating new user:", newUser);
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password || 'tempPassword123',
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
    fetchUsers, // Export the fetchUsers function for manual refreshing
  };
};
