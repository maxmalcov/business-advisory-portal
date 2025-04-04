
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '../types';
import { useAuth } from '@/context/auth';

export const useUserManagement = () => {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);

  // Helper function to map DB profiles to our User interface
  const mapProfileToUser = (profile: any): User => ({
    id: profile.id,
    name: profile.full_name || '',
    email: profile.email,
    companyName: profile.company_name || '',
    userType: profile.user_type,
    incomingInvoiceEmail: profile.incoming_invoice_email || '',
    outgoingInvoiceEmail: profile.outgoing_invoice_email || '',
    iframeUrls: profile.iframe_urls || [],
  });

  // Fetch users using a direct RPC call to is_admin to bypass potential recursion issues
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      // First check if current user is admin using RPC 
      if (currentUser) {
        const { data: isAdmin, error: adminCheckError } = await supabase.rpc('is_admin', {
          user_id: currentUser.id
        });
        
        if (adminCheckError) {
          throw adminCheckError;
        }
        
        if (!isAdmin) {
          toast({
            variant: 'destructive',
            title: 'Access Denied',
            description: 'You do not have permission to view this page.',
          });
          setIsLoading(false);
          return;
        }
        
        // If admin, fetch all profiles
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*');
        
        if (error) throw error;
        
        if (profiles) {
          const mappedUsers = profiles.map(mapProfileToUser);
          setUsers(mappedUsers);
        }
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to load users',
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, toast]);

  useEffect(() => {
    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser, fetchUsers]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleEditUser = (user: User) => {
    setEditingUser({...user});
  };

  const handleUpdateUser = (user: User) => {
    setEditingUser(user);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    
    try {
      // Map our User interface back to the DB profile format
      const profileData = {
        full_name: editingUser.name,
        email: editingUser.email,
        company_name: editingUser.companyName,
        user_type: editingUser.userType,
        incoming_invoice_email: editingUser.incomingInvoiceEmail,
        outgoing_invoice_email: editingUser.outgoingInvoiceEmail,
        iframe_urls: editingUser.iframeUrls
      };
      
      // Update user profile in database
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', editingUser.id);
      
      if (error) throw error;
      
      // Update local state
      setUsers(users.map(user => 
        user.id === editingUser.id ? editingUser : user
      ));
      
      toast({
        title: "User Updated",
        description: `${editingUser.name}'s details have been updated successfully.`,
      });
      
      setEditingUser(null);
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message || 'Failed to update user details',
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
      // We can't directly insert into auth.users, so we'll register a new user
      // This is a placeholder - in a real app, you would use Supabase's admin API or server-side functions
      
      // Generate a random password for the new user (in real app, send email with password reset link)
      const tempPassword = Math.random().toString(36).slice(-8);
      
      // Register user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: newUser.email,
        password: tempPassword,
        options: {
          data: {
            full_name: newUser.name,
            user_type: newUser.userType,
          },
        },
      });
      
      if (error) throw error;
      
      // The user is now created, but we'll need to update their profile with additional details
      if (data.user) {
        const profileData = {
          id: data.user.id,
          full_name: newUser.name,
          email: newUser.email,
          company_name: newUser.companyName,
          user_type: newUser.userType,
          incoming_invoice_email: newUser.incomingInvoiceEmail,
          outgoing_invoice_email: newUser.outgoingInvoiceEmail,
          iframe_urls: newUser.iframeUrls
        };
        
        // Update the profile
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert(profileData);
        
        if (profileError) throw profileError;
        
        // Refresh the users list
        fetchUsers();
        
        toast({
          title: "User Created",
          description: `${newUser.name} has been added successfully.`,
        });
        
        setIsAddingUser(false);
      }
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        variant: 'destructive',
        title: 'Creation Failed',
        description: error.message || 'Failed to create user',
      });
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.companyName && user.companyName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return {
    users: filteredUsers,
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
  };
};
