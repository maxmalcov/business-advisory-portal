import { useToast } from '@/hooks/use-toast';
import { User } from './types';
import { supabase } from '@/integrations/supabase/client';

export const useToggleUserStatus = (
  users: User[],
  setUsers: React.Dispatch<React.SetStateAction<User[]>>,
) => {
  const { toast } = useToast();

  // Toggle user active status with database persistence
  const toggleUserStatus = async (user: User) => {
    try {
      const newStatus = !user.isActive;
      console.log(`Setting user ${user.id} active status to: ${newStatus}`);

      // Update the profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          // We need to map isActive to a field in the profiles table
          // The profiles table doesn't have an isActive field directly,
          // so we'll use the usertype field to track status
          // We'll append "-inactive" to usertype when deactivated
          usertype: newStatus
            ? user.userType.replace('-inactive', '')
            : `${user.userType.replace('-inactive', '')}-inactive`,
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Update local state
      setUsers(
        users.map((u) =>
          u.id === user.id ? { ...u, isActive: newStatus } : u,
        ),
      );

      toast({
        title: newStatus ? 'User Activated' : 'User Deactivated',
        description: `${user.name}'s status was successfully changed.`,
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        variant: 'destructive',
        title: 'Status Update Error',
        description: 'An error occurred while changing the user status.',
      });
    }
  };

  return { toggleUserStatus };
};
