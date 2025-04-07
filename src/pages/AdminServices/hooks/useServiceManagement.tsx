
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { servicesTable, Service } from '@/integrations/supabase/client';

export const useServiceManagement = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [iconName, setIconName] = useState('Package');
  const [badges, setBadges] = useState('');
  const [popular, setPopular] = useState(false);

  // Fetch services from Supabase - optimized to prevent flickering
  useEffect(() => {
    let isMounted = true;
    
    const fetchServices = async () => {
      try {
        if (!isMounted) return;
        
        setLoading(true);
        
        const { data, error } = await servicesTable()
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        if (data && isMounted) {
          // Explicitly cast the data to the Service type
          setServices(data as any as Service[]);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        if (isMounted) {
          toast({
            title: "Error",
            description: "Failed to load services",
            variant: "destructive"
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchServices();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [toast]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPrice('');
    setIconName('Package');
    setBadges('');
    setPopular(false);
    setCurrentService(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const openEditDialog = (service: Service) => {
    setCurrentService(service);
    setTitle(service.title);
    setDescription(service.description);
    setPrice(service.price.toString());
    setIconName(service.iconName);
    setBadges(service.badges ? service.badges.join(', ') : '');
    setPopular(service.popular);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const serviceData = {
        title,
        description,
        price: parseFloat(price),
        iconName,
        badges: badges.split(',').map(b => b.trim()).filter(b => b),
        popular
      };

      if (isEditMode && currentService) {
        // Update existing service
        const { error } = await servicesTable()
          .update(serviceData as any)
          .eq('id', currentService.id);
          
        if (error) {
          throw error;
        }
        
        // Update local state
        setServices(prev => 
          prev.map(s => s.id === currentService.id ? { ...s, ...serviceData } : s)
        );
        
        toast({
          title: "Service Updated",
          description: `${title} has been updated successfully.`,
        });
      } else {
        // Add new service
        const { data, error } = await servicesTable()
          .insert(serviceData as any)
          .select();
          
        if (error) {
          throw error;
        }
        
        if (data) {
          // Add to local state
          setServices(prev => [(data[0] as any as Service), ...prev]);
        }
        
        toast({
          title: "Service Added",
          description: `${title} has been added successfully.`,
        });
      }
      
      // Close dialog and reset form
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving service:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save service. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    
    try {
      setLoading(true);
      
      const { error } = await servicesTable()
        .delete()
        .eq('id', serviceId);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setServices(prev => prev.filter(s => s.id !== serviceId));
      
      toast({
        title: "Service Deleted",
        description: "The service has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete service. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    services,
    loading,
    isDialogOpen,
    setIsDialogOpen,
    isEditMode,
    title,
    setTitle,
    description,
    setDescription,
    price,
    setPrice,
    iconName,
    setIconName,
    badges,
    setBadges,
    popular,
    setPopular,
    openAddDialog,
    openEditDialog,
    handleSubmit,
    handleDelete
  };
};
