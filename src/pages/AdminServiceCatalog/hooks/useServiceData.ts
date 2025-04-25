
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  category?: string;
  status: 'active' | 'inactive';
  created_at: string;
}

// Mock data for demonstration
const mockServices: Service[] = [
  {
    id: '1',
    title: 'Payroll Setup',
    description: 'Complete payroll system setup and configuration',
    price: 299.99,
    category: 'Payroll',
    status: 'active',
    created_at: '2025-01-15T12:00:00Z'
  },
  {
    id: '2',
    title: 'Accounting Help',
    description: 'Professional accounting assistance and consultation',
    price: 149.99,
    category: 'Accounting',
    status: 'active',
    created_at: '2025-02-10T15:30:00Z'
  }
];

export const useServiceData = () => {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleDelete = useCallback((serviceId: string) => {
    setDeleteId(serviceId);
    setIsDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (!deleteId) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setServices((prev) => prev.filter((service) => service.id !== deleteId));
      toast({
        title: "Service deleted",
        description: "The service has been removed successfully",
      });
      setDeleteId(null);
      setIsDeleteDialogOpen(false);
      setLoading(false);
    }, 500);
  }, [deleteId, toast]);

  const cancelDelete = useCallback(() => {
    setDeleteId(null);
    setIsDeleteDialogOpen(false);
  }, []);

  const DeleteConfirmationDialog = useCallback(() => (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the service.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={confirmDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ), [isDeleteDialogOpen, cancelDelete, confirmDelete]);

  return {
    services,
    loading,
    handleDelete,
    DeleteConfirmationDialog
  };
};
