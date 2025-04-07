
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from './types';

export const useDeleteUser = (refreshUsers: () => Promise<void>) => {
  const { toast } = useToast();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Handle user deletion
  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setShowConfirmDelete(true);
  };

  // Confirm user deletion
  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      console.log("Attempting to delete user profile:", userToDelete.id);
      
      // Delete the profile from profiles table
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userToDelete.id);
      
      if (error) {
        console.error('Error deleting profile:', error);
        throw error;
      }
      
      // Refresh the users list
      await refreshUsers();
      
      toast({
        title: "User Deleted",
        description: `User ${userToDelete.name} was successfully deleted.`,
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        variant: 'destructive',
        title: 'Delete Error',
        description: 'An error occurred while deleting the user.',
      });
    } finally {
      setUserToDelete(null);
      setShowConfirmDelete(false);
    }
  };

  return {
    showConfirmDelete,
    userToDelete,
    handleDeleteUser,
    confirmDeleteUser,
    setShowConfirmDelete
  };
};
