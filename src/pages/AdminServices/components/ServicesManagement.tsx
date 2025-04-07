
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Service, supabase } from '@/integrations/supabase/client';
import ServicesTable from './ServicesTable';
import ServicesFilters from './ServicesFilters';
import ServiceFormDialog from './ServiceFormDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ServicesManagement: React.FC = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch services from Supabase
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching services...');
        
        // Using type assertion to bypass TypeScript limitation
        // We know services table exists, but TypeScript doesn't recognize it
        const { data, error } = await (supabase
          .from('services') as any)
          .select('*')
          .order('title', { ascending: true });
          
        if (error) {
          console.error('Supabase error:', error);
          setError(`Error fetching data: ${error.message}`);
          throw error;
        }
        
        console.log('Services fetched:', data);
        
        if (data) {
          // Use type assertion to tell TypeScript that this is an array of Service objects
          setServices(data as Service[]);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        setError('Failed to load services');
        toast({
          title: "Error",
          description: "Failed to load services",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
    
    // Set up a realtime subscription for updates to the services table
    const subscription = supabase
      .channel('services_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'services' 
      }, (payload) => {
        console.log('Change received!', payload);
        fetchServices();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [toast]);

  const handleCreateService = () => {
    setServiceToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditService = (service: Service) => {
    setServiceToEdit(service);
    setIsFormOpen(true);
  };

  const handleSaveService = async (serviceData: Partial<Service>) => {
    try {
      if (serviceToEdit) {
        // Update existing service
        const { error } = await (supabase
          .from('services') as any)
          .update(serviceData)
          .eq('id', serviceToEdit.id);
          
        if (error) throw error;
        
        toast({
          title: "Service Updated",
          description: `Service "${serviceData.title}" has been updated.`,
        });
      } else {
        // Create new service
        const { error } = await (supabase
          .from('services') as any)
          .insert(serviceData);
          
        if (error) throw error;
        
        toast({
          title: "Service Created",
          description: `Service "${serviceData.title}" has been created.`,
        });
      }
      
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error saving service:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save service. Please try again.",
        variant: "destructive"
      });
    }
  };

  const confirmDelete = (service: Service) => {
    setServiceToDelete(service);
  };

  const handleDeleteService = async () => {
    if (!serviceToDelete) return;
    
    try {
      setIsDeleting(true);
      
      const { error } = await (supabase
        .from('services') as any)
        .delete()
        .eq('id', serviceToDelete.id);
        
      if (error) throw error;
      
      toast({
        title: "Service Deleted",
        description: `Service "${serviceToDelete.title}" has been deleted.`,
      });
      
      setServiceToDelete(null);
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete service. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (service: Service) => {
    try {
      const newStatus = service.status === 'active' ? 'inactive' : 'active';
      
      const { error } = await (supabase
        .from('services') as any)
        .update({ status: newStatus })
        .eq('id', service.id);
        
      if (error) throw error;
      
      toast({
        title: "Status Updated",
        description: `Service "${service.title}" is now ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update service status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (service.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Extract unique categories for the filter
  const categories = Array.from(new Set(services.filter(s => s.category).map(s => s.category)));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage Services</h2>
        <Button onClick={handleCreateService}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Service
        </Button>
      </div>
      
      <ServicesFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categories={categories as string[]}
      />
      
      {error && (
        <div className="p-4 mb-4 text-white bg-red-500 rounded-md">
          <p><strong>Error:</strong> {error}</p>
          <p>Check browser console for more details.</p>
        </div>
      )}
      
      <ServicesTable 
        loading={loading}
        filteredServices={filteredServices}
        onEdit={handleEditService}
        onDelete={confirmDelete}
        onToggleStatus={handleToggleStatus}
      />
      
      <ServiceFormDialog 
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        service={serviceToEdit}
        onSave={handleSaveService}
        categories={categories as string[]}
      />
      
      <AlertDialog open={!!serviceToDelete} onOpenChange={(open) => !open && setServiceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the service "{serviceToDelete?.title}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteService}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ServicesManagement;
