
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export type SubscriptionTypeFormData = {
  name: string;
  description: string;
  type_id?: string;  // Make this optional to match form field name
  type?: string;     // Add this to match form field name
  icon_type: 'iframe' | 'calendar' | 'crm' | 'timetracking';
  iconType?: string; // Add this to match form field name
};

export const useSubscriptionTypes = () => {
  const [loading, setLoading] = useState(false);

  const createSubscriptionType = async (data: SubscriptionTypeFormData) => {
    try {
      setLoading(true);
      
      // Map the form data to the expected format for the database
      const type_id = data.type_id || data.type || '';
      const icon_type = data.icon_type || data.iconType || 'iframe';
      
      // Create a new subscription type in the database using a raw query
      // Use any type to bypass TypeScript's strict checking for RPC functions
      const { error } = await (supabase.rpc as any)('create_subscription_type', {
        p_name: data.name,
        p_description: data.description,
        p_type_id: type_id,
        p_icon_type: icon_type,
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
