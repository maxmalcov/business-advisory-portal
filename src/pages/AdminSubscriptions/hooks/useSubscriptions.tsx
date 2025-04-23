
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
      const { data, error } = await supabase
        .from('user_tool_subscriptions')
        .select(`
          *,
          profiles:user_id(name)
        `)
        .order('requested_at', { ascending: false });

      if (error) throw error;

      const formattedData: Subscription[] = data.map(sub => ({
        id: sub.id,
        name: sub.tool_name,
        type: sub.tool_id as 'iframe' | 'calendar' | 'crm' | 'timetracking',
        userName: sub.profiles?.name || 'Unknown User',
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
