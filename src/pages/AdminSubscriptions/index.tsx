import React, { useEffect, useState } from 'react';
import { useSubscriptions } from './hooks/useSubscriptions';
import { useSubscriptionTypes } from './hooks/useSubscriptionTypes';
import SubscriptionHeader from './components/SubscriptionHeader';
import SubscriptionTable from './components/SubscriptionTable';
import SubscriptionDialog from './components/SubscriptionDialog';
import SubscriptionTypeDialog from './components/SubscriptionTypeDialog';
import { Subscription } from './types';
import { toast } from '@/components/ui/use-toast';

const AdminSubscriptions = () => {
  const { 
    subscriptions, 
    loading, 
    fetchSubscriptions,
    updateSubscriptionStatus
  } = useSubscriptions();
  
  const {
    createSubscriptionType
  } = useSubscriptionTypes();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
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

  const handleAddNewTypeClick = () => {
    setIsTypeDialogOpen(true);
  };

  const handleEditSubscription = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleSubscriptionSubmit = async (subscription: Subscription) => {
    try {
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

  const handleSubscriptionTypeSubmit = async (data: any) => {
    try {
      await createSubscriptionType(data);
      setIsTypeDialogOpen(false);
    } catch (error) {
      console.error('Error creating subscription type:', error);
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
      <SubscriptionHeader 
        onAddNew={handleAddNewClick} 
        onAddNewType={handleAddNewTypeClick}
      />
      
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

      <SubscriptionTypeDialog
        isOpen={isTypeDialogOpen}
        onOpenChange={setIsTypeDialogOpen}
        onSubmit={handleSubscriptionTypeSubmit}
      />
    </div>
  );
};

export default AdminSubscriptions;
