
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
      
      // First, fetch all auth users to ensure we have the complete list
      const { data: authData, error: authError } = await supabase.auth.getUsers();
      
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
      
      // Create a set of profile IDs for quick lookup
      const profileIds = new Set(transformedUsers.map(user => user.id));
      
      // Check if there are auth users without profiles
      if (authData && authData.users) {
        console.log("Checking for auth users without profiles...");
        
        const usersWithoutProfiles = authData.users.filter(
          authUser => !profileIds.has(authUser.id)
        );
        
        if (usersWithoutProfiles.length > 0) {
          console.log(`Found ${usersWithoutProfiles.length} auth users without profiles`);
          
          // Create profile entries for these users
          for (const authUser of usersWithoutProfiles) {
            try {
              const email = authUser.email || '';
              const name = authUser.user_metadata?.name || email.split('@')[0] || 'Unknown User';
              
              // Create a new profile for this user
              const { error: insertError } = await supabase
                .from('profiles')
                .insert([{
                  id: authUser.id,
                  email: email,
                  name: name,
                  usertype: 'client'
                }]);
              
              if (insertError) {
                console.error(`Error creating profile for user ${authUser.id}:`, insertError);
                continue;
              }
              
              // Add this user to our transformed users list
              transformedUsers.push({
                id: authUser.id,
                name: name,
                email: email,
                userType: 'client',
                iframeUrls: [],
                isActive: true
              });
              
              console.log(`Created profile for user ${authUser.id}`);
            } catch (error) {
              console.error(`Error processing auth user ${authUser.id}:`, error);
            }
          }
        }
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
