
import { useState, useEffect } from 'react';
import { Service, servicesTable } from '@/integrations/supabase/client';

export const useServiceEditor = (serviceId: string | undefined, resetForm: () => void) => {
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState<Service | null>(null);

  // Fetch service data when editing an existing service
  useEffect(() => {
    const fetchService = async () => {
      if (!serviceId) {
        setLoading(false);
        resetForm();
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await servicesTable()
          .select('*')
          .eq('id', serviceId)
          .single();

        if (error) {
          throw error;
        }

        setService(data as Service);
      } catch (error) {
        console.error('Error fetching service:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId, resetForm]);

  // Save or update a service
  const saveService = async (formData: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
    if (serviceId) {
      // Update existing service
      const { error } = await servicesTable()
        .update({
          title: formData.title,
          description: formData.description,
          price: formData.price,
          iconName: formData.iconName,
          badges: formData.badges,
          popular: formData.popular,
          category: formData.category,
          status: formData.status
        })
        .eq('id', serviceId);

      if (error) throw error;
    } else {
      // Create new service
      const { error } = await servicesTable().insert({
        title: formData.title,
        description: formData.description,
        price: formData.price,
        iconName: formData.iconName,
        badges: formData.badges,
        popular: formData.popular,
        category: formData.category,
        status: formData.status
      });

      if (error) throw error;
    }
  };

  return {
    loading,
    service,
    saveService
  };
};
