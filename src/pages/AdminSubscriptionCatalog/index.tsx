
import React, {useCallback} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layers, Plus } from 'lucide-react';
import {SubscriptionType, useSubscriptionTypes} from './hooks/useSubscriptionTypes';
import SubscriptionTypeTable from './components/SubscriptionTypeTable';
import { PageHeader } from '@/components/ui/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import SubscriptionTypeDialog from '../AdminSubscriptions/components/SubscriptionTypeDialog';
import { toast } from '@/components/ui/use-toast';
import {useLanguage} from "@/context/LanguageContext.tsx";
import {subscriptionTypeTable} from "@/integrations/supabase/client.ts";

const AdminSubscriptionCatalog: React.FC = () => {
  const { loading, subscriptionTypes, handleDelete, DeleteConfirmationDialog, createSubscriptionType } = useSubscriptionTypes();
  const [isTypeDialogOpen, setIsTypeDialogOpen] = React.useState(false);
  let [editSubscription, setEditSubscription] = React.useState(null);

  const handleAddNewTypeClick = () => {
    setEditSubscription(null)
    setIsTypeDialogOpen(true);
  };
  const handleEdit = useCallback(async (typeId: string) => {
    const {data, error} = await subscriptionTypeTable().select('*').eq('id', typeId).single()

    editSubscription = data

    if(error){
      throw new Error('Internal server error')
    }

    setEditSubscription(data)
    setIsTypeDialogOpen(true);
  }, []);

  const handleSubscriptionTypeSubmit = async (data: any) => {
    try {
      console.log('Submitting subscription type data:', data);
      await createSubscriptionType(data);
      setIsTypeDialogOpen(false);
      toast({
        title: t('subscriptions.admin.created'),
        description: t('subscriptions.admin.created.description')
      });
    } catch (error) {
      console.error('Error creating subscription type:', error);
    }
  };

  const {t} = useLanguage()

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Layers className="h-6 w-6" />}
        title={t('subscriptions.admin.title')}
        subtitle={t('subscriptions.admin.description')}
      />
      
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('subscriptions.admin.table.title')}</CardTitle>
          <Button 
            disabled={loading}
            onClick={handleAddNewTypeClick}
          >
            <Plus className="h-4 w-4 mr-2" /> {t('subscriptions.admin.add-new')}
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ) : subscriptionTypes.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">{t('subscriptions.admin.no-subscriptions')}</p>
            </div>
          ) : (
            <SubscriptionTypeTable 
              subscriptionTypes={subscriptionTypes}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          )}
        </CardContent>
      </Card>
      
      <SubscriptionTypeDialog
        isOpen={isTypeDialogOpen}
        onOpenChange={setIsTypeDialogOpen}
        onSubmit={handleSubscriptionTypeSubmit}
        editSubscription={editSubscription}
      />
      
      <DeleteConfirmationDialog />
    </div>
  );
};

export default AdminSubscriptionCatalog;
