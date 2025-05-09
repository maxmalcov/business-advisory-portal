import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, UserType, AccountType } from './types';
import {useLanguage} from "@/context/LanguageContext.tsx";

export const useAddUser = (refreshUsers?: () => Promise<void>) => {
  const { toast } = useToast();
  const [isAddingUser, setIsAddingUser] = useState(false);
  const {t} = useLanguage()
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({
    name: '',
    email: '',
    userType: 'client' as UserType,
    accountType: 'freelancer' as AccountType,
    iframeUrls: [],
    phone: '',
    nif: '',
    address: '',
    postalCode: '',
    city: '',
    province: '',
    country: '',
    companyName: '',
    isActive: true,
    password: '',
    adminName: '',
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
      ((newUser.accountType &&
        ['sl', 'sa', 'freelancer'].includes(newUser.accountType) &&
        newUser.companyName) ||
        (newUser.accountType &&
          newUser.accountType === 'individual' &&
          newUser.name)),
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
      userType: 'client' as UserType,
      accountType: 'freelancer' as AccountType,
      iframeUrls: [],
      phone: '',
      nif: '',
      address: '',
      postalCode: '',
      city: '',
      province: '',
      country: '',
      companyName: '',
      isActive: true,
      password: '',
      adminName: '',
    });
  };

  // Save new user - using Supabase auth signup
  const handleSaveNewUser = async (newUserData: Omit<User, 'id'>) => {
    try {
      if (!newUserData.email || !newUserData.password) {
        throw new Error('Email and password are required');
      }
      //
      // // Store iframeUrls separately as it's not part of the Supabase auth metadata
      const iframeUrlsToStore = newUserData.iframeUrls || [];
      //
      // // Register the user with Supabase Auth
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
          },
        },
      });

      if(authError){
        toast({
          title: t('toast.admin.new-user.title'),
          description: t('toast.admin.new-user.description'),
          variant: 'destructive'
        })
        throw new Error('Auth error')
      }

      console.log(authData.user.id)
      const {data, error} = await supabase.from('profiles').update({
        name: newUserData.name || '',
        usertype: newUserData.userType || 'client',
        companyname: newUserData.companyName || '-',
        accounttype: newUserData.accountType || 'freelancer',
        nif: newUserData.nif || '',
        address: newUserData.address || '',
        postalcode: newUserData.postalCode || '',
        city: newUserData.city || '',
        province: newUserData.province || '',
        country: newUserData.country || '',
        phone: newUserData.phone || '',
        incominginvoiceemail: newUserData.incomingInvoiceEmail || '',
        outgoinginvoiceemail: newUserData.outgoingInvoiceEmail || '',
        iframeurls: iframeUrlsToStore
      }).eq('id', authData.user.id)
    //
    //   if (authError) {
    //     console.error('Error creating user in Auth:', authError);
    //     throw authError;
    //   }
    //
    //   if (!authData.user) {
    //     throw new Error('User creation failed: No user data returned');
    //   }
    //
    //   console.log('User created in Auth:', authData);
    //
    //   // Update profiles table with additional data if needed
    //   // For iframe URLs, we will handle them separately - it seems this field
    //   // doesn't exist in the profiles table as expected
    //   if (iframeUrlsToStore.length > 0) {
    //     console.log('Iframe URLs to store:', iframeUrlsToStore);
    //
    //     // Log profiles schema to understand the available columns
    //     const { data: profileSchema, error: schemaError } = await supabase
    //       .from('profiles')
    //       .select('*')
    //       .limit(1);
    //
    //     console.log('Profile schema sample:', profileSchema);
    //
    //     // For now, we won't attempt to store the iframe URLs since
    //     // the column doesn't seem to exist in the profiles table
    //     // We'll need to handle this differently or add the column to the database
    //   }
    //
    //   // Refresh the users list
    //   if (refreshUsers) {
    //     await refreshUsers();
    //   }
    //
    //   toast({
    //     title: 'User Created',
    //     description: `${newUserData.name || newUserData.companyName || 'New user'} was successfully added.`,
    //   });
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        variant: 'destructive',
        title: 'Creation Error',
        description:
          error.message || 'An error occurred while creating the user.',
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
    isFormValid,
  };
};
