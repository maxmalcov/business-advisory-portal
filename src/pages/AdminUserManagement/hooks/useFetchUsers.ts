
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { User } from './types';

export const useFetchUsers = () => {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch users from profiles table
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching users from profiles table as", currentUser?.userType);
      
      // With our RLS policies, admins can see all profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }
      
      if (profilesData) {
        console.log("Fetched profiles:", profilesData.length);
        
        // Transform the profiles data to match our User interface
        const transformedUsers: User[] = profilesData.map(profile => {
          return {
            id: profile.id,
            name: profile.name || '',
            email: profile.email || '',
            companyName: profile.companyname || '',
            userType: profile.usertype || 'client',
            incomingInvoiceEmail: profile.incominginvoiceemail || '',
            outgoingInvoiceEmail: profile.outgoinginvoiceemail || '',
            iframeUrls: [], // This may need to be added to the profiles table
            isActive: true // We don't have banned status in profiles, assume all are active
          };
        });
        
        console.log("Transformed users:", transformedUsers);
        setUsers(transformedUsers);
      } else {
        console.log("No profiles data returned from Supabase");
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

  return {
    users: filteredUsers,
    isLoading,
    searchQuery,
    setSearchQuery,
    refreshUsers: fetchUsers
  };
};
