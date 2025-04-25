
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { serviceRequestsTable } from '@/integrations/supabase/client';

export interface ServiceRequest {
  id: string;
  service_id: string;
  service_name: string;
  client_id: string;
  status: string;
  request_date: string;
  admin_notes?: string;
}

export const useServiceRequests = () => {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchServiceRequests = async () => {
      if (!user) return;

      try {
        const { data, error } = await serviceRequestsTable()
          .select('*')
          .eq('client_id', user.id)
          .order('request_date', { ascending: false });

        if (error) throw error;
        
        setServiceRequests(data || []);
      } catch (error) {
        console.error('Error fetching service requests:', error);
        setServiceRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceRequests();
  }, [user]);

  return { serviceRequests, loading };
};
