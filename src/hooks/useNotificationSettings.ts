
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {useLanguage} from "@/context/LanguageContext.tsx";

interface NotificationSetting {
  id: string;
  category: string;
  email: string;
}

export const useNotificationSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['notification-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*');

      if (error) {
        console.error('Error fetching notification settings:', error);
        throw error;
      }

      return data as NotificationSetting[];
    },
  });

  const {t} = useLanguage()

  const updateMutation = useMutation({
    mutationFn: async ({ category, email }: { category: string; email: string }) => {
      setIsUpdating(true);
      const { error } = await supabase
        .from('notification_settings')
        .update({ email })
        .eq('category', category);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-settings'] });
      toast({
        title: t('settings.toast.success.title'),
        description: t('settings.toast.success.description'),
      });
    },
    onError: (error) => {
      console.error('Error updating notification settings:', error);
      toast({
        title: t('settings.toast.failed.title'),
        description: t('settings.toast.failed.description'),
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsUpdating(false);
    },
  });

  return {
    settings,
    isLoading,
    isUpdating,
    updateSetting: updateMutation.mutate,
  };
};
