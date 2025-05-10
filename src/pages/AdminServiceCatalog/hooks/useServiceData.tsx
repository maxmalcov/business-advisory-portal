import { useEffect, useState, useCallback } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/use-toast';
import { servicesTable } from '@/integrations/supabase/client.ts';
import { useLanguage } from '@/context/LanguageContext.tsx';

// Types
export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  category?: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export const useServiceData = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [services, setServices] = useState<Service[]>([]);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await servicesTable().select('*');
        if (error) {
          return;
        }
        setServices(data as unknown as Service[]);
      } catch (error) {
        console.error('Database error', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleDelete = useCallback((serviceId: string) => {
    setDeleteId(serviceId);
    setIsDeleteDialogOpen(true);
  }, []);

  const { t } = useLanguage();

  const confirmDelete = useCallback(async () => {
    if (deleteId) {
      setLoading(true);

      await servicesTable().delete().eq('id', deleteId);

      setTimeout(() => {
        setServices((prevServices) =>
          prevServices.filter((service) => service.id !== deleteId),
        );

        toast({
          title: t('service.deleted'),
          description: t('service.description'),
        });

        setLoading(false);
        setIsDeleteDialogOpen(false);
        setDeleteId(null);
      }, 10);
    }
  }, [deleteId]);

  const cancelDelete = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setDeleteId(null);
  }, []);

  const DeleteConfirmationDialog = () => (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('service.alert.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('service.alert.description')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={cancelDelete}>
            {t('service.alert.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={confirmDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t('service.alert.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return {
    services,
    loading,
    handleDelete,
    DeleteConfirmationDialog,
  };
};
