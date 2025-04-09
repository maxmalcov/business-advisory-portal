
import { useState } from 'react';
import { usefulLinksTable } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { UsefulLink } from '@/pages/UsefulLinks/types';
import { UsefulLinkFormValues } from '../components/UsefulLinkForm';

export function useUsefulLinks() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addLink = async (values: UsefulLinkFormValues): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const { error } = await usefulLinksTable().insert(values);
          
      if (error) throw error;
      
      toast({
        title: 'Link added',
        description: 'The link has been successfully added.',
      });
      
      return true;
    } catch (error) {
      console.error('Error adding link:', error);
      toast({
        title: 'Error',
        description: 'Failed to add the link. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateLink = async (id: string, values: UsefulLinkFormValues): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const { error } = await usefulLinksTable()
        .update(values)
        .eq('id', id);
          
      if (error) throw error;
      
      toast({
        title: 'Link updated',
        description: 'The link has been successfully updated.',
      });
      
      return true;
    } catch (error) {
      console.error('Error updating link:', error);
      toast({
        title: 'Error',
        description: 'Failed to update the link. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteLink = async (id: string): Promise<boolean> => {
    try {
      const { error } = await usefulLinksTable()
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Link deleted',
        description: 'The link has been successfully deleted.',
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting link:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the link. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    addLink,
    updateLink,
    deleteLink,
    isSubmitting
  };
}
