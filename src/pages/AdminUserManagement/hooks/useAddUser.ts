
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
    accountType: 'freelancer',
    iframeUrls: [],
    phone: '',
    nif: '',
    address: '',
    postalCode: '',
    city: '',
    province: '',
    country: '',
    companyName: ''
  });
  
  // Check if form is valid
  const isFormValid = Boolean(
    newUser.email && 
    newUser.userType &&
    newUser.password &&
    newUser.phone &&
    newUser.nif &&
    newUser.address &&
    newUser.postalCode &&
    newUser.city &&
    newUser.province &&
    newUser.country &&
    (
      (newUser.accountType && ['sl', 'sa', 'freelancer'].includes(newUser.accountType) && newUser.companyName) || 
      (newUser.accountType && newUser.accountType === 'individual' && newUser.name)
    )
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
      accountType: 'freelancer',
      iframeUrls: [],
      phone: '',
      nif: '',
      address: '',
      postalCode: '',
      city: '',
      province: '',
      country: '',
      companyName: ''
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
            accountType: newUserData.accountType || 'freelancer',
            nif: newUserData.nif || '',
            address: newUserData.address || '',
            postalCode: newUserData.postalCode || '',
            city: newUserData.city || '',
            province: newUserData.province || '',
            country: newUserData.country || '',
            phone: newUserData.phone || '',
            incomingInvoiceEmail: newUserData.incomingInvoiceEmail || '',
            outgoingInvoiceEmail: newUserData.outgoingInvoiceEmail || '',
            adminName: newUserData.adminName || '',
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
      
      // Update profiles table with additional data if needed
      if (newUserData.iframeUrls && newUserData.iframeUrls.length > 0) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            iframeUrls: newUserData.iframeUrls
          })
          .eq('id', authData.user.id);
          
        if (updateError) {
          console.error('Error updating user profile with iframeUrls:', updateError);
          // Don't throw error here, as the user was created successfully
        }
      }
      
      // Refresh the users list
      if (refreshUsers) {
        await refreshUsers();
      }
      
      toast({
        title: "User Created",
        description: `${newUserData.name || newUserData.companyName || 'New user'} was successfully added.`,
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
