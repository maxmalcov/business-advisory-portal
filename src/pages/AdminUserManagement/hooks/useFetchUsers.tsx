
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from './types';

export const useFetchUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching users from Supabase...");
      
      // Instead of using getUsers() which no longer exists, we'll use getUser() without params
      // or rely primarily on the profiles table which is more reliable
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Error fetching auth users:', authError);
        // Continue to fetch profiles even if auth users fetch fails
      }
      
      // Fetch all user profiles from the profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*');

      if (profileError) {
        throw profileError;
      }
      
      let transformedUsers: User[] = [];
      
      if (profileData) {
        console.log("Fetched profiles data:", profileData);
        
        transformedUsers = profileData.map(profile => ({
          id: profile.id,
          name: profile.name || '',
          email: profile.email || '',
          companyName: profile.companyname,
          userType: profile.usertype || 'client',
          incomingInvoiceEmail: profile.incominginvoiceemail,
          outgoingInvoiceEmail: profile.outgoinginvoiceemail,
          iframeUrls: [],
          isActive: true
        }));
      }
      
      console.log("Final transformed users:", transformedUsers);
      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load users'
      });
      
      // If admin access failed, fall back to just fetching profiles
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*');
  
        if (profileError) throw profileError;
        
        if (profileData) {
          console.log("Fallback: Fetched profiles data:", profileData);
          
          const transformedUsers = profileData.map(profile => ({
            id: profile.id,
            name: profile.name || '',
            email: profile.email || '',
            companyName: profile.companyname,
            userType: profile.usertype || 'client',
            incomingInvoiceEmail: profile.incominginvoiceemail,
            outgoingInvoiceEmail: profile.outgoinginvoiceemail,
            iframeUrls: [],
            isActive: true
          }));
          
          setUsers(transformedUsers);
        }
      } catch (fallbackError) {
        console.error('Error in fallback profile fetch:', fallbackError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    setUsers,
    isLoading,
    fetchUsers
  };
};
