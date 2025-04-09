
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from './types';

export const useAddUser = (refreshUsers?: () => Promise<void>) => {
  const { toast } = useToast();
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({
    name: '',
    email: '',
    userType: 'client',
    iframeUrls: []
  });
  
  // Check if form is valid
  const isFormValid = Boolean(
    newUser.name && 
    newUser.email && 
    newUser.userType
  );

  // Handle user data changes
  const handleUserChange = (user: Omit<User, 'id'>) => {
    setNewUser(user);
  };

  // Open add user dialog
  const handleAddUser = () => {
    setIsAddingUser(true);
  };

  // Cancel adding user
  const handleCancelAddUser = () => {
    setIsAddingUser(false);
    // Reset form
    setNewUser({
      name: '',
      email: '',
      userType: 'client',
      iframeUrls: []
    });
  };

  // Save new user - using Supabase auth signup
  const handleSaveNewUser = async (newUserData: Omit<User, 'id'>) => {
    try {
      if (!newUserData.email || !newUserData.password) {
        throw new Error("Email and password are required");
      }
      
      console.log("Creating new user:", {...newUserData, password: '[REDACTED]'});
      
      // Register the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUserData.email,
        password: newUserData.password,
        options: {
          data: {
            name: newUserData.name || '',
            userType: newUserData.userType || 'client',
            companyName: newUserData.companyName || '',
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
      if (refreshUsers) {
        await refreshUsers();
      }
      
      toast({
        title: "User Created",
        description: `${newUserData.name || 'New user'} was successfully added.`,
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
    handleSaveNewUser,
    newUser,
    handleUserChange,
    isFormValid
  };
};
