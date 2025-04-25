
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

// Types
export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  category?: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export const useServiceData = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      title: 'Financial Consulting',
      description: 'Expert financial consulting for businesses',
      price: 299.99,
      category: 'Finance',
      status: 'active',
      created_at: '2025-01-15T12:00:00Z'
    },
    {
      id: '2',
      title: 'Tax Filing Assistance',
      description: 'Professional assistance with tax filing for individuals and businesses',
      price: 149.99,
      category: 'Tax',
      status: 'active',
      created_at: '2025-02-10T15:30:00Z'
    },
    {
      id: '3',
      title: 'Business Plan Development',
      description: 'Strategic business plan development for startups',
      price: 499.99,
      category: 'Business',
      status: 'inactive',
      created_at: '2025-03-05T09:15:00Z'
    }
  ]);

  // For delete confirmation dialog
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = useCallback((serviceId: string) => {
    setDeleteId(serviceId);
    setIsDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (deleteId) {
      setLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        setServices((prevServices) => 
          prevServices.filter((service) => service.id !== deleteId)
        );
        
        toast({
          title: "Service deleted",
          description: "The service has been successfully removed",
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

  const DeleteConfirmationDialog = () => (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the service 
            from the system.
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
    services,
    loading,
    handleDelete,
    DeleteConfirmationDialog
  };
};
