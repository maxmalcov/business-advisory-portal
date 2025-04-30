
import React, { useEffect, useState } from 'react';
import { useSubscriptions } from '../AdminSubscriptions/hooks/useSubscriptions';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Inbox } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import SubscriptionTable from '../AdminSubscriptions/components/SubscriptionTable';
import { AssignSubscriptionDialog } from '../AdminSubscriptions/components/subscription-assign/AssignSubscriptionDialog';
import { toast } from '@/components/ui/use-toast';
import { Subscription } from '../AdminSubscriptions/types';
import {useLanguage} from "@/context/LanguageContext.tsx";

const AdminSubscriptionRequests = () => {
  const { 
    subscriptions, 
    loading, 
    fetchSubscriptions,
    updateSubscriptionStatus
  } = useSubscriptions();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [editRequestId, setEditRequestId] = useState<string | null>(null)

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleEditSubscription = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const {t} = useLanguage()

  const handleStatusChange = async (subscriptionId: string, newStatus: Subscription['status'], iframeUrl?: string) => {
    try {
      if(newStatus == 'active'){

      }
      await updateSubscriptionStatus(subscriptionId, newStatus, iframeUrl);
      const statusMessages = {
        active: t('subscription.admin.message.description.active'),
        inactive: t('subscription.admin.message.description.inactive'),
        rejected: t('subscription.admin.message.description.reject'),
        pending: t('subscription.admin.message.description.pending')
      };
      toast({
        title: t('subscription.admin.message.title'),
        description: statusMessages[newStatus]
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        variant: "destructive",
        title: t('subscription.admin.error'),
        description: t("subscription.admin.error.description")
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Inbox className="h-6 w-6" />}
        title={t('subscriptions.requests.title')}
        subtitle={t('subscriptions.requests.subtitle')}
      />
      
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{t('subscriptions.requests.card.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ) : !subscriptions || subscriptions.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">{t('subscriptions.requests.not-found')}</p>
            </div>
          ) : (
            <SubscriptionTable 
              subscriptions={subscriptions}
              loading={loading}
              onStatusChange={handleStatusChange}
              onEdit={handleEditSubscription}
            />
          )}
        </CardContent>
      </Card>
      
      <AssignSubscriptionDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={fetchSubscriptions}
        subscription={selectedSubscription}
      />
    </div>
  );
};

export default AdminSubscriptionRequests;
