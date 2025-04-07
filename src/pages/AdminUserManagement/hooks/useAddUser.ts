
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from './types';

export const useAddUser = (refreshUsers: () => Promise<void>) => {
  const { toast } = useToast();
  const [isAddingUser, setIsAddingUser] = useState(false);

  // Open add user dialog
  const handleAddUser = () => {
    setIsAddingUser(true);
  };

  // Cancel adding user
  const handleCancelAddUser = () => {
    setIsAddingUser(false);
  };

  // Save new user - using Supabase auth signup
  const handleSaveNewUser = async (newUser: Omit<User, 'id'>) => {
    try {
      if (!newUser.email || !newUser.password) {
        throw new Error("Email and password are required");
      }
      
      console.log("Creating new user:", {...newUser, password: '[REDACTED]'});
      
      // Register the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          data: {
            name: newUser.name || '',
            userType: newUser.userType || 'client',
            companyName: newUser.companyName || '',
          }
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
      
      // Refresh the users list
      await refreshUsers();
      
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
    isAddingUser,
    handleAddUser,
    handleCancelAddUser,
    handleSaveNewUser
  };
};
