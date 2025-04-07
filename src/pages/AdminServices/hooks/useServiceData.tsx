
import { useState, useEffect } from 'react';
import { Service, servicesTable } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export const useServiceData = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const { data, error } = await servicesTable()
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        // Add proper type assertion to resolve TypeScript error
        setServices(data as Service[]);
      } catch (error) {
        console.error('Error fetching services:', error);
        toast({
          title: 'Error',
          description: 'Failed to load services.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, [toast]);

  // Delete service
  const handleDelete = (serviceId: string) => {
    setConfirmDeleteId(serviceId);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    
    try {
      setLoading(true);
      
      const { error } = await servicesTable()
        .delete()
        .eq('id', confirmDeleteId);
        
      if (error) {
        throw error;
      }
      
      setServices(services.filter(service => service.id !== confirmDeleteId));
      
      toast({
        title: 'Service deleted',
        description: 'The service has been deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete service. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setConfirmDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setConfirmDeleteId(null);
  };

  // Deletion confirmation dialog
  const DeleteConfirmationDialog = () => (
    <AlertDialog open={!!confirmDeleteId} onOpenChange={(open) => !open && cancelDelete()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            service and all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return {
    services,
    setServices,
    loading,
    setLoading,
    handleDelete,
    DeleteConfirmationDialog
  };
};
