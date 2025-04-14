
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from './types';

export const useUpdateUser = (refreshUsers: () => Promise<void>) => {
  const { toast } = useToast();
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Handle user edit
  const handleEditUser = (user: User) => {
    console.log("Setting user to edit:", user);
    setEditingUser({...user});
  };

  // Handle user update
  const handleUpdateUser = (updatedUser: User) => {
    console.log("Updating user in local state:", updatedUser);
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
          phone: editingUser.phone,
          accounttype: editingUser.accountType,
          incominginvoiceemail: editingUser.incomingInvoiceEmail, 
          outgoinginvoiceemail: editingUser.outgoingInvoiceEmail,
          address: editingUser.address,
          postalcode: editingUser.postalCode,
          city: editingUser.city,
          province: editingUser.province,
          country: editingUser.country,
          nif: editingUser.nif
        })
        .eq('id', editingUser.id);

      if (error) {
        console.error('Error updating user:', error);
        throw error;
      }

      // Refresh the users list
      await refreshUsers();
      
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

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  return {
    editingUser,
    handleEditUser,
    handleUpdateUser,
    handleSaveUser,
    handleCancelEdit
  };
};
