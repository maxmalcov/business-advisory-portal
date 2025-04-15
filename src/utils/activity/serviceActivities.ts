
import { supabase } from '@/integrations/supabase/client';
import { ActivityEvent } from './types';

export const fetchServiceActivities = async (
  isAdmin: boolean,
  userId: string | undefined
): Promise<ActivityEvent[]> => {
  const activities: ActivityEvent[] = [];
  
  try {
    // Fetch service request completions - admins see all, users see only their own
    let servicesQuery = supabase.from('service_requests') as any;
    if (!isAdmin && userId) {
      servicesQuery = servicesQuery.eq('client_id', userId);
    }
    
    const { data: services, error: servicesError } = await servicesQuery
      .select('id, service_name, status, updated_at')
      .eq('status', 'completed')
      .order('updated_at', { ascending: false })
      .limit(5);

    if (servicesError) {
      console.error('Error fetching services:', servicesError);
    } else if (services) {
      services.forEach(service => {
        activities.push({
          id: `service-${service.id}`,
          type: 'service-completed',
          timestamp: new Date(service.updated_at),
          title: 'Service completed',
          description: `Service "${service.service_name}" has been completed.`,
          metadata: { serviceId: service.id, serviceName: service.service_name }
        });
      });
    }
    
    return activities;
  } catch (error) {
    console.error('Error fetching service activities:', error);
    return [];
  }
};
