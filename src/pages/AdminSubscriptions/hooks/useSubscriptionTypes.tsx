
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export type SubscriptionTypeFormData = {
  name: string;
  description: string;
  type: string;
  iconType: 'iframe' | 'calendar' | 'crm' | 'timetracking';
};

export const useSubscriptionTypes = () => {
  const [loading, setLoading] = useState(false);

  const createSubscriptionType = async (data: SubscriptionTypeFormData) => {
    try {
      setLoading(true);
      
      // Create a new subscription type in the database
      const { error } = await supabase
        .from('subscription_types')
        .insert({
          name: data.name,
          description: data.description,
          type_id: data.type,
          icon_type: data.iconType,
          status: 'active', // Default to active so it appears for clients
        });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Subscription type "${data.name}" has been created.`
      });
      
      return true;
    } catch (error) {
      console.error('Error creating subscription type:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create subscription type."
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createSubscriptionType
  };
};
