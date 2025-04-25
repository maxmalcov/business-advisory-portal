
import { useState, useCallback } from 'react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/use-toast';
import { useSubscriptionTypes as useAdminSubscriptionTypes } from '../../AdminSubscriptions/hooks/useSubscriptionTypes';

// Types
export interface SubscriptionType {
  id: string;
  name: string;
  description: string;
  type_id: string;
  icon_type: 'iframe' | 'calendar' | 'crm' | 'timetracking';
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export const useSubscriptionTypes = () => {
  const { createSubscriptionType: adminCreateSubscriptionType, loading: adminLoading } = useAdminSubscriptionTypes();
  const [loading, setLoading] = useState<boolean>(false);
  const [subscriptionTypes, setSubscriptionTypes] = useState<SubscriptionType[]>([
    {
      id: '1',
      name: 'IFrame Dashboard',
      description: 'Access your custom dashboard with real-time data',
      type_id: 'iframe1',
      icon_type: 'iframe',
      status: 'active',
      created_at: '2025-01-15T12:00:00Z',
      updated_at: '2025-01-15T12:00:00Z'
    },
    {
      id: '2',
      name: 'Calendar Integration',
      description: 'Schedule and manage your calendar events',
      type_id: 'calendar',
      icon_type: 'calendar',
      status: 'active',
      created_at: '2025-02-10T15:30:00Z',
      updated_at: '2025-02-10T15:30:00Z'
    },
    {
      id: '3',
      name: 'CRM Tool',
      description: 'Customer relationship management tool',
      type_id: 'crm',
      icon_type: 'crm',
      status: 'inactive',
      created_at: '2025-03-05T09:15:00Z',
      updated_at: '2025-03-05T09:15:00Z'
    },
    {
      id: '4',
      name: 'Time Tracking',
      description: 'Track and manage your work hours',
      type_id: 'timetracking',
      icon_type: 'timetracking',
      status: 'active',
      created_at: '2025-03-15T14:45:00Z',
      updated_at: '2025-03-15T14:45:00Z'
    }
  ]);

  // For delete confirmation dialog
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = useCallback((typeId: string) => {
    setDeleteId(typeId);
    setIsDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (deleteId) {
      setLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        setSubscriptionTypes((prevTypes) => 
          prevTypes.filter((type) => type.id !== deleteId)
        );
        
        toast({
          title: "Subscription type deleted",
          description: "The subscription type has been successfully removed",
        });
        
        setLoading(false);
        setIsDeleteDialogOpen(false);
        setDeleteId(null);
      }, 500);
    }
  }, [deleteId]);

  const cancelDelete = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setDeleteId(null);
  }, []);
  
  // Function to create a subscription type
  const createSubscriptionType = async (data: any) => {
    try {
      setLoading(true);
      // Call the admin createSubscriptionType function
      await adminCreateSubscriptionType(data);
      
      // Add the new subscription type to the local state
      // In a real app this would come from the API response
      const newType: SubscriptionType = {
        id: Math.random().toString(36).substring(2, 9),
        name: data.name,
        description: data.description,
        type_id: data.type_id || data.type || '',
        icon_type: data.icon_type || data.iconType || 'iframe',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setSubscriptionTypes(prev => [newType, ...prev]);
      
      return true;
    } catch (error) {
      console.error('Error creating subscription type:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const DeleteConfirmationDialog = () => (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this subscription type
            and may affect users who have active subscriptions of this type.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return {
    subscriptionTypes,
    loading: loading || adminLoading,
    handleDelete,
    DeleteConfirmationDialog,
    createSubscriptionType
  };
};
