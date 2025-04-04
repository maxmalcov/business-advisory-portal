
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '../types';
import { useAuth } from '@/context/AuthContext';

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newIframeUrl, setNewIframeUrl] = useState('');
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  // Transform Supabase profile data to our User interface
  const transformProfileData = (profile: any): User => ({
    id: profile.id,
    name: profile.full_name || '',
    email: profile.email,
    companyName: profile.company_name || '',
    userType: profile.user_type,
    incomingInvoiceEmail: profile.incoming_invoice_email || '',
    outgoingInvoiceEmail: profile.outgoing_invoice_email || '',
    iframeUrls: profile.iframe_urls || [],
  });

  // Fetch users from database
  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUser || currentUser.userType !== 'admin') {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        console.log('Fetching users...');
        
        // Use RPC call to is_admin function to avoid RLS recursion
        const { data: isAdminCheck, error: adminCheckError } = await supabase
          .rpc('is_admin', { user_id: currentUser.id });
        
        if (adminCheckError) {
          console.error('Admin check error:', adminCheckError);
          throw adminCheckError;
        }
        
        if (!isAdminCheck) {
          toast({
            variant: 'destructive',
            title: 'Access Denied',
            description: 'You do not have administrator privileges',
          });
          setIsLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*');
        
        if (error) {
          console.error('Error fetching users:', error);
          throw error;
        }
        
        if (data) {
          const transformedUsers = data.map(transformProfileData);
          setUsers(transformedUsers);
          setFilteredUsers(transformedUsers);
        }
      } catch (error: any) {
        console.error('Error in user management:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.message || 'Failed to load users',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [currentUser, toast]);

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.companyName && user.companyName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleEditUser = (user: User) => {
    setEditingUser({...user});
  };

  const handleUpdateUser = (updatedUser: User) => {
    setEditingUser(updatedUser);
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

  const handleSaveUser = async () => {
    if (!editingUser) return;
    
    try {
      // Map our User interface back to Supabase profile data structure
      const profileData = {
        full_name: editingUser.name,
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

  const handleSaveNewUser = async (newUser: Partial<User>) => {
    try {
      // In a real app, you would call an API to create a new user with authentication
      // For now, we'll just display a toast
      toast({
        title: "User Creation",
        description: "In a production environment, this would create a new user account.",
      });
      
      // Close the add user dialog
      setIsAddingUser(false);
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        variant: 'destructive',
        title: 'Creation Failed',
        description: error.message || 'Failed to create new user',
      });
    }
  };

  return {
    users: filteredUsers,
    isLoading,
    searchQuery,
    editingUser,
    isAddingUser,
    newIframeUrl,
    handleSearch,
    handleEditUser,
    handleUpdateUser,
    handleSaveUser,
    handleCancelEdit,
    handleAddUser,
    handleCancelAddUser,
    handleSaveNewUser,
    setNewIframeUrl,
  };
};
