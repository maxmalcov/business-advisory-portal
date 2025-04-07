
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

  // Fetch users from Supabase
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching users from Supabase...");
      
      // Use the service role client to bypass RLS and fetch all users
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('Error fetching auth users:', authError);
        throw authError;
      }

      if (authUsers && authUsers.users) {
        console.log("Fetched auth users:", authUsers.users.length);
        
        // Get all profiles for additional user data
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*');
        
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        }
        
        // Create a map of profiles for efficient lookup
        const profilesMap = new Map();
        if (profilesData) {
          profilesData.forEach(profile => {
            profilesMap.set(profile.id, profile);
          });
        }
        
        // Transform the auth users data to match our User interface
        const transformedUsers: User[] = authUsers.users.map(user => {
          const profile = profilesMap.get(user.id);
          
          return {
            id: user.id,
            name: profile?.name || user.user_metadata?.name || '',
            email: user.email || profile?.email || '',
            companyName: profile?.companyname || user.user_metadata?.companyName || '',
            userType: profile?.usertype || user.user_metadata?.userType || 'client',
            incomingInvoiceEmail: profile?.incominginvoiceemail || '',
            outgoingInvoiceEmail: profile?.outgoinginvoiceemail || '',
            iframeUrls: [], // This may need to be added to the profiles table
            isActive: !user.banned_until // Consider a user active if they are not banned
          };
        });
        
        console.log("Transformed users:", transformedUsers);
        setUsers(transformedUsers);
      } else {
        console.log("No users data returned from Supabase");
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
      // Update the user in Supabase - ensure column names match the database
      const { error } = await supabase
        .from('profiles')
        .update({
          name: editingUser.name,
          email: editingUser.email,
          usertype: editingUser.userType, // Match database column name (lowercase)
          companyname: editingUser.companyName, // Match database column name (lowercase)
          incominginvoiceemail: editingUser.incomingInvoiceEmail, // Match database column name (lowercase)
          outgoinginvoiceemail: editingUser.outgoingInvoiceEmail // Match database column name (lowercase)
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
      console.log("Attempting to delete user:", userToDelete.id);
      
      // Delete the user using Supabase Auth Admin API
      const { error } = await supabase.auth.admin.deleteUser(userToDelete.id);
      
      if (error) {
        console.error('Error deleting user:', error);
        throw error;
      }
      
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
    try {
      const newStatus = !user.isActive;
      console.log(`Setting user ${user.id} active status to: ${newStatus}`);
      
      // Use the admin API to update user status
      const { error } = await supabase.auth.admin.updateUserById(
        user.id,
        { ban_duration: newStatus ? '0 seconds' : '365 days' }
      );
      
      if (error) throw error;
      
      // Update local state
      setUsers(users.map(u => 
        u.id === user.id ? { ...u, isActive: newStatus } : u
      ));
      
      toast({
        title: newStatus ? "User Activated" : "User Deactivated",
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

  // Save new user - IMPROVED IMPLEMENTATION
  const handleSaveNewUser = async (newUser: Omit<User, 'id'>) => {
    try {
      if (!newUser.email || !newUser.password) {
        throw new Error("Email and password are required");
      }
      
      console.log("Creating new user:", {...newUser, password: '[REDACTED]'});
      
      // Register the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newUser.email,
        password: newUser.password,
        email_confirm: true,
        user_metadata: {
          name: newUser.name || '',
          userType: newUser.userType || 'client',
          companyName: newUser.companyName || '',
        }
      });
      
      if (authError) {
        console.error('Error creating user in Auth:', authError);
        throw authError;
      }
      
      if (!authData.user) {
        throw new Error("User creation failed: No user data returned");
      }
      
      console.log("User created in Auth:", authData);
      
      // Fetch users again to update the list
      await fetchUsers();
      
      toast({
        title: "User Created",
        description: `${newUser.name || 'New user'} was successfully added.`,
      });
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        variant: 'destructive',
        title: 'Creation Error',
        description: error.message || 'An error occurred while creating the user.',
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
