import { useState, useEffect } from 'react';
import { Service, servicesTable } from '@/integrations/supabase/client';

export const useServiceEditor = (
  serviceId: string | undefined,
  resetForm: () => void,
) => {
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
        console.log('Fetching service with ID:', serviceId);
        const { data, error } = await servicesTable()
          .select('*')
          .eq('id', serviceId)
          .single();

        if (error) {
          throw error;
        }

        // Properly handle typing by first checking that data is not null
        if (data) {
          // Convert data to unknown first and then to Service to satisfy TypeScript
          console.log('Service data fetched:', data);
          setService(data as unknown as Service);
        } else {
          setService(null);
        }
      } catch (error) {
        console.error('Error fetching service:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId, resetForm]);

  // Save or update a service
  const saveService = async (
    formData: Omit<Service, 'id' | 'created_at' | 'updated_at'>,
  ) => {
    console.log('Saving service:', formData, 'serviceId:', serviceId);
    try {
      if (serviceId) {
        // Update existing service - using correct column names matching database schema
        const { error } = await servicesTable()
          .update({
            title: formData.title,
            description: formData.description,
            price: formData.price,
            iconname: formData.iconName, // Changed to match database column name
            badges: formData.badges,
            popular: formData.popular,
            category: formData.category,
            status: formData.status,
          })
          .eq('id', serviceId);

        if (error) throw error;
      } else {
        // Create new service - using correct column names matching database schema
        const { error } = await servicesTable().insert({
          title: formData.title,
          description: formData.description,
          price: formData.price,
          iconname: formData.iconName, // Changed to match database column name
          badges: formData.badges,
          popular: formData.popular,
          category: formData.category,
          status: formData.status,
        });

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error in saveService:', error);
      throw error;
    }
  };

  return {
    loading,
    service,
    saveService,
  };
};
