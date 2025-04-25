
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useNotificationCounts() {
  const [pendingServices, setPendingServices] = useState(0);
  const [pendingSubscriptions, setPendingSubscriptions] = useState(0);

  useEffect(() => {
    fetchCounts();
    setupRealtimeSubscription();
  }, []);

  const fetchCounts = async () => {
    // Fetch pending service requests count
    const { count: serviceCount, error: serviceError } = await supabase
      .from('service_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (!serviceError && serviceCount !== null) {
      setPendingServices(serviceCount);
    }

    // Fetch pending subscription requests count
    const { count: subscriptionCount, error: subscriptionError } = await supabase
      .from('user_tool_subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (!subscriptionError && subscriptionCount !== null) {
      setPendingSubscriptions(subscriptionCount);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('notification-counts')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'service_requests' },
        () => fetchCounts()
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'user_tool_subscriptions' },
        () => fetchCounts()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return {
    pendingServices,
    pendingSubscriptions
  };
}
