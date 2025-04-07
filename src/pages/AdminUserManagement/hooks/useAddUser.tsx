
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from './types';

interface UseAddUserProps {
  fetchUsers: () => Promise<void>;
}

export const useAddUser = ({ fetchUsers }: UseAddUserProps) => {
  const { toast } = useToast();
  const [isAddingUser, setIsAddingUser] = useState(false);

  const handleAddUser = () => {
    setIsAddingUser(true);
  };

  const handleCancelAddUser = () => {
    setIsAddingUser(false);
  };

  const handleSaveNewUser = async (newUser: Omit<User, 'id'>) => {
    try {
      console.log("Creating new user:", newUser);
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password || 'tempPassword123',
        options: {
          data: {
            name: newUser.name,
            userType: newUser.userType,
            companyName: newUser.companyName,
            incomingInvoiceEmail: newUser.incomingInvoiceEmail,
            outgoingInvoiceEmail: newUser.outgoingInvoiceEmail
          }
        }
      });
      
      if (authError) throw authError;
      console.log("User created in Auth:", authData);

      // Create a profile explicitly
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: authData.user.id,
            email: newUser.email,
            name: newUser.name,
            usertype: newUser.userType,
            companyname: newUser.companyName,
            incominginvoiceemail: newUser.incomingInvoiceEmail,
            outgoinginvoiceemail: newUser.outgoingInvoiceEmail
          }]);
          
        if (profileError) {
          console.error('Error creating profile for new user:', profileError);
        }
      }

      // Wait a moment and then fetch users
      setTimeout(() => {
        fetchUsers();
      }, 1000);
      
      toast({
        title: "User Created",
        description: `${newUser.name} was successfully added. Note: The user will need to verify their email before they can log in.`,
      });
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        variant: 'destructive',
        title: 'Creation Error',
        description: 'An error occurred while creating the user.',
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
