
import React, { useEffect, useState } from 'react';
import { useSubscriptions } from './hooks/useSubscriptions';
import SubscriptionHeader from './components/SubscriptionHeader';
import SubscriptionTable from './components/SubscriptionTable';
import SubscriptionDialog from './components/SubscriptionDialog';
import { Subscription } from './types';
import { toast } from '@/components/ui/use-toast';

const AdminSubscriptions = () => {
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

  const handleAddNewClick = () => {
    setIsEditMode(false);
    setSelectedSubscription(null);
    setIsDialogOpen(true);
  };

  const handleEditSubscription = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleSubscriptionSubmit = async (subscription: Subscription) => {
    try {
      // This will be implemented later
      console.log('Subscription submitted:', subscription);
      setIsDialogOpen(false);
      toast({
        title: isEditMode ? "Subscription Updated" : "Subscription Created",
        description: `Successfully ${isEditMode ? 'updated' : 'created'} the subscription.`
      });
      await fetchSubscriptions();
    } catch (error) {
      console.error('Error submitting subscription:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save the subscription. Please try again."
      });
    }
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
      <SubscriptionHeader onAddNew={handleAddNewClick} />
      
      <SubscriptionTable 
        subscriptions={subscriptions}
        loading={loading}
        onStatusChange={handleStatusChange}
        onEdit={handleEditSubscription}
      />

      <SubscriptionDialog
        isOpen={isDialogOpen}
        isEditMode={isEditMode}
        selectedSubscription={selectedSubscription}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubscriptionSubmit}
      />
    </div>
  );
};

export default AdminSubscriptions;
