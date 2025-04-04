
import { useState } from 'react';
import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useCreateAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const [adminCreated, setAdminCreated] = useState(false);
  const { toast } = useToast();

  const createAdmin = async () => {
    setIsLoading(true);
    
    try {
      // Call the create-admin edge function
      const { data, error } = await supabase.functions.invoke('create-admin');
      
      if (error) throw error;
      
      if (data.success) {
        setAdminCreated(true);
        toast({
          title: "Admin Created",
          description: `Admin account created: ${data.email} / ${data.password}`,
        });
        return data;
      } else {
        if (data.adminExists) {
          toast({
            title: "Admin Already Exists",
            description: "An admin user already exists in the system.",
          });
        } else {
          throw new Error(data.message || "Failed to create admin user");
        }
      }
    } catch (error) {
      console.error("Error creating admin:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create admin user",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { createAdmin, isLoading, adminCreated };
}
