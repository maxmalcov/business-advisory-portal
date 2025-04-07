
import { useToast } from '@/hooks/use-toast';
import { User } from './types';

interface UseUserStatusProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export const useUserStatus = ({ users, setUsers }: UseUserStatusProps) => {
  const { toast } = useToast();

  const toggleUserStatus = async (user: User) => {
    const updatedUser = { ...user, isActive: !user.isActive };
    
    try {
      // For now, we're just updating the local state
      // In a real app, you might want to update user status in auth system
      setUsers(users.map(u => u.id === user.id ? updatedUser : u));
      
      toast({
        title: updatedUser.isActive ? "User Activated" : "User Deactivated",
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

  return {
    toggleUserStatus
  };
};
