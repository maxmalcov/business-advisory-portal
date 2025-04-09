
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { usefulLinksTable, UsefulLinkDB } from '@/integrations/supabase/client';
import AdminUsefulLinksHeader from './components/AdminUsefulLinksHeader';
import UsefulLinksTable from './components/UsefulLinksTable';
import { UsefulLink } from '../UsefulLinks/types';
import { useToast } from '@/components/ui/use-toast';

const AdminUsefulLinks = () => {
  const { toast } = useToast();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-useful-links'],
    queryFn: async () => {
      const { data, error } = await usefulLinksTable()
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      
      // First convert to unknown then to our expected type to avoid TypeScript errors
      return (data as unknown) as UsefulLinkDB[];
    }
  });

  // Convert from database type to component type
  const links: UsefulLink[] = React.useMemo(() => {
    return data ? data.map(link => ({
      id: link.id,
      title: link.title,
      description: link.description,
      url: link.url,
      category: link.category,
      icon: link.icon,
      display_order: link.display_order,
      created_at: link.created_at,
      updated_at: link.updated_at
    })) : [];
  }, [data]);

  const handleDeleteLink = async (id: string) => {
    try {
      const { error } = await usefulLinksTable()
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
        links={links} 
        isLoading={isLoading}
        error={error}
        onDelete={handleDeleteLink}
        refetch={refetch}
      />
    </div>
  );
};

export default AdminUsefulLinks;
