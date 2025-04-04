
import React, { useState } from 'react';
import { toast } from 'sonner';
import { initialSubscriptions } from './mockData';
import { Subscription } from './types';
import SubscriptionTable from './components/SubscriptionTable';
import SubscriptionDialog from './components/SubscriptionDialog';
import SubscriptionHeader from './components/SubscriptionHeader';

const AdminSubscriptions: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleStatusChange = (subscriptionId: string, newStatus: 'active' | 'pending' | 'rejected' | 'inactive') => {
    setSubscriptions(prevSubscriptions => 
      prevSubscriptions.map(subscription => 
        subscription.id === subscriptionId 
          ? { ...subscription, status: newStatus } 
          : subscription
      )
    );

    toast.success(`Subscription status updated to ${newStatus}`);
  };

  const handleEdit = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedSubscription(null);
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = (subscription: Subscription) => {
    if (isEditMode) {
      // Update existing subscription
      setSubscriptions(prevSubscriptions => 
        prevSubscriptions.map(item => 
          item.id === subscription.id 
            ? subscription 
            : item
        )
      );
      toast.success('Subscription updated successfully');
    } else {
      // Add new subscription
      const newSubscription = {
        ...subscription,
        id: `subscription-${Date.now()}`, // Generate a temporary ID
      };
      setSubscriptions(prevSubscriptions => [...prevSubscriptions, newSubscription]);
      toast.success('New subscription added successfully');
    }

    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <SubscriptionHeader onAddNew={handleAdd} />
      
      <SubscriptionTable 
        subscriptions={subscriptions}
        onStatusChange={handleStatusChange}
        onEdit={handleEdit}
      />

      <SubscriptionDialog
        isOpen={isDialogOpen}
        isEditMode={isEditMode}
        selectedSubscription={selectedSubscription}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default AdminSubscriptions;
