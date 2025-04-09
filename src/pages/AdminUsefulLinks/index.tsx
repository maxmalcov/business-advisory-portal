
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminUsefulLinksHeader from './components/AdminUsefulLinksHeader';
import UsefulLinksTable from './components/UsefulLinksTable';
import { UsefulLink } from '../UsefulLinks/types';
import { useToast } from '@/components/ui/use-toast';

const AdminUsefulLinks = () => {
  const { toast } = useToast();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-useful-links'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('useful_links')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as UsefulLink[];
    }
  });

  const handleDeleteLink = async (id: string) => {
    try {
      const { error } = await supabase
        .from('useful_links')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await refetch();
      toast({
        title: 'Link deleted',
        description: 'The link has been successfully deleted.',
      });
    } catch (error) {
      console.error('Error deleting link:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the link. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <AdminUsefulLinksHeader refetch={refetch} />
      <UsefulLinksTable 
        links={data || []} 
        isLoading={isLoading}
        error={error}
        onDelete={handleDeleteLink}
        refetch={refetch}
      />
    </div>
  );
};

export default AdminUsefulLinks;
