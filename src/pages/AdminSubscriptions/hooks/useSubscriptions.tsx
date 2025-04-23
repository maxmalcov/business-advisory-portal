
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Subscription } from '../types';

export const useSubscriptions = () => {
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      
      // First fetch all subscriptions
      const { data: subscriptionsData, error: subscriptionsError } = await supabase
        .from('user_tool_subscriptions')
        .select('*')
        .order('requested_at', { ascending: false });

      if (subscriptionsError) throw subscriptionsError;

      // Then fetch user profiles in a separate query
      const userIds = subscriptionsData.map(sub => sub.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Create a map of user_id to name for easy lookup
      const userNameMap = new Map();
      profilesData?.forEach(profile => {
        userNameMap.set(profile.id, profile.name || 'Unknown User');
      });

      // Combine the data
      const formattedData: Subscription[] = subscriptionsData.map(sub => ({
        id: sub.id,
        name: sub.tool_name,
        type: sub.tool_id as 'iframe' | 'calendar' | 'crm' | 'timetracking',
        userName: userNameMap.get(sub.user_id) || 'Unknown User',
        userId: sub.user_id,
        status: sub.status as Subscription['status'],
        url: sub.iframe_url || '',
        demoVideoUrl: sub.demo_video_url,
        createdAt: sub.requested_at
      }));

      setSubscriptions(formattedData);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast({
        variant: "destructive",
        title: "Error loading subscriptions",
        description: "There was a problem loading the subscription data."
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSubscriptionStatus = async (
    subscriptionId: string, 
    newStatus: Subscription['status'],
    iframeUrl?: string
  ) => {
    try {
      const updates = {
        status: newStatus,
        ...(newStatus === 'active' ? {
          activated_at: new Date().toISOString(),
          iframe_url: iframeUrl
        } : {}),
        updated_at: new Date().toISOString(),
        updated_by: (await supabase.auth.getUser()).data.user?.id
      };

      const { error } = await supabase
        .from('user_tool_subscriptions')
        .update(updates)
        .eq('id', subscriptionId);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: `Subscription status changed to ${newStatus}`
      });

      await fetchSubscriptions();
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast({
        variant: "destructive",
        title: "Error updating status",
        description: "There was a problem updating the subscription status."
      });
    }
  };

  return {
    subscriptions,
    loading,
    fetchSubscriptions,
    updateSubscriptionStatus
  };
};
