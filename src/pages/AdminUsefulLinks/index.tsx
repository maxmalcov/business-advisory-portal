
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usefulLinksTable, UsefulLinkDB } from '@/integrations/supabase/client';
import AdminUsefulLinksHeader from './components/AdminUsefulLinksHeader';
import UsefulLinksTable from './components/UsefulLinksTable';
import { UsefulLink } from '../UsefulLinks/types';
import { useToast } from '@/components/ui/use-toast';
import AddEditLinkDialog from './components/AddEditLinkDialog';

const AdminUsefulLinks = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-useful-links'],
    queryFn: async () => {
      const { data, error } = await usefulLinksTable()
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      
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

  const handleAddNew = () => {
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <AdminUsefulLinksHeader onAddNew={handleAddNew} />
      <UsefulLinksTable 
        links={links} 
        isLoading={isLoading}
        error={error}
        refetch={refetch}
      />

      <AddEditLinkDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        mode="add"
        onSuccess={() => {
          refetch();
          setIsDialogOpen(false);
        }}
      />
    </div>
  );
};

export default AdminUsefulLinks;
