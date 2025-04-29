
import {useState, useCallback, useEffect} from 'react';
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
import { useSubscriptionTypes as useAdminSubscriptionTypes } from '../../AdminSubscriptions/hooks/useSubscriptionTypes';
import {subscriptionTypeTable} from "@/integrations/supabase/client.ts";
import {useLanguage} from "@/context/LanguageContext.tsx";

// Types
export interface SubscriptionType {
  id: string;
  name: string;
  description: string;
  type_id: string;
  icon_type: 'iframe' | 'calendar' | 'crm' | 'timetracking';
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export const useSubscriptionTypes = () => {
  const { createSubscriptionType: adminCreateSubscriptionType, loading: adminLoading } = useAdminSubscriptionTypes();
  const [loading, setLoading] = useState<boolean>(false);
  const [subscriptionTypes, setSubscriptionTypes] = useState<SubscriptionType[]>([]);
  const {t} = useLanguage()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await subscriptionTypeTable().select('*');
      if (error) {
        console.error('Error fetching subscription types:', error);
        toast({
          title: "Internal Error",
          description: '',
        });
      } else {
        setSubscriptionTypes((data as any) || []);
      }
      setLoading(false);
    };

    fetchData();
  }, []);


  // For delete confirmation dialog
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = useCallback((typeId: string) => {
    setDeleteId(typeId);
    setIsDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (deleteId) {
      setLoading(true);
      
      // Simulate API call delay
      await subscriptionTypeTable().delete().eq('id', deleteId)

      setSubscriptionTypes((prevTypes) =>
        prevTypes.filter((type) => type.id !== deleteId)
      );

      toast({
        title: t('subscriptions.admin.delete.toast.title'),
        description: t('subscriptions.admin.delete.toast.description'),
      });

      setLoading(false);
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
    }
  }, [deleteId]);

  const cancelDelete = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setDeleteId(null);
  }, []);
  
  // Function to create a subscription type
  const createSubscriptionType = async (data: any) => {
    try {
      setLoading(true);
      // Call the admin createSubscriptionType function
      await adminCreateSubscriptionType(data);
      
      // const newType: SubscriptionType = {
      //   id: Math.random().toString(36).substring(2, 9),
      //   name: data.name,
      //   description: data.description,
      //   type_id: data.type_id || data.type || '',
      //   icon_type: data.icon_type || data.iconType || 'iframe',
      //   status: 'active',
      //   created_at: new Date().toISOString(),
      //   updated_at: new Date().toISOString(),
      // };
      //
      // setSubscriptionTypes(prev => [newType, ...prev]);
      
      return true;
    } catch (error) {
      console.error('Error creating subscription type:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const DeleteConfirmationDialog = () => (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('subscriptions.admin.remove.areyousure')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('subscriptions.admin.remove.warning')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={cancelDelete}>{t('subscriptions.admin.remove.button.cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            {t('subscriptions.admin.remove.button.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return {
    subscriptionTypes,
    loading: loading || adminLoading,
    handleDelete,
    DeleteConfirmationDialog,
    createSubscriptionType,
  };
};
