
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from './types';

interface UseDeleteUserProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export const useDeleteUser = ({ users, setUsers }: UseDeleteUserProps) => {
  const { toast } = useToast();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setShowConfirmDelete(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      // Note: Deleting users from auth requires admin privileges and 
      // cannot be done from client-side code. Instead, we'll just delete
      // the profile and indicate this limitation to the user.
      
      // Delete the profile from the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userToDelete.id);

      if (profileError) throw profileError;

      setUsers(users.filter(user => user.id !== userToDelete.id));
      
      toast({
        title: "User Profile Deleted",
        description: `User ${userToDelete.name}'s profile was successfully deleted. Note: The auth record may still exist and requires admin action in the Supabase dashboard.`,
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        variant: 'destructive',
        title: 'Delete Error',
        description: 'An error occurred while deleting the user profile.',
      });
    } finally {
      setUserToDelete(null);
      setShowConfirmDelete(false);
    }
  };

  return {
    showConfirmDelete,
    userToDelete,
    setShowConfirmDelete,
    handleDeleteUser,
    confirmDeleteUser
  };
};
