
import { useToast } from '@/hooks/use-toast';
import { servicesTable, Service } from '@/integrations/supabase/client';

export const useServiceSubmit = (
  setLoading: (loading: boolean) => void,
  setServices: (services: Service[] | ((prev: Service[]) => Service[])) => void,
  setIsDialogOpen: (isOpen: boolean) => void,
  resetForm: () => void
) => {
  const { toast } = useToast();

  const handleSubmit = async (
    isEditMode: boolean,
    currentService: Service | null,
    formData: any
  ) => {
    try {
      setLoading(true);
      
      if (isEditMode && currentService) {
        // Update existing service
        const { error } = await servicesTable()
          .update(formData as any)
          .eq('id', currentService.id);
          
        if (error) {
          throw error;
        }
        
        // Update local state
        setServices(prev => 
          prev.map(s => s.id === currentService.id ? { ...s, ...formData } : s)
        );
        
        toast({
          title: "Service Updated",
          description: `${formData.title} has been updated successfully.`,
        });
      } else {
        // Add new service
        const { data, error } = await servicesTable()
          .insert(formData as any)
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
          description: `${formData.title} has been added successfully.`,
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

  return { handleSubmit };
};
