
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

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleEditSubscription = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleStatusChange = async (subscriptionId: string, newStatus: Subscription['status'], iframeUrl?: string) => {
    try {
      await updateSubscriptionStatus(subscriptionId, newStatus, iframeUrl);
      const statusMessages = {
        active: 'Subscription activated successfully',
        inactive: 'Subscription stopped successfully',
        rejected: 'Subscription rejected successfully',
        pending: 'Subscription status updated to pending'
      };
      toast({
        title: "Status Updated",
        description: statusMessages[newStatus]
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update subscription status. Please try again."
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Inbox className="h-6 w-6" />}
        title="Subscription Requests"
        subtitle="Manage user subscription requests"
      />
      
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Subscription Requests</CardTitle>
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
              <p className="text-muted-foreground">No subscription requests found.</p>
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
      />
    </div>
  );
};

export default AdminSubscriptionRequests;
