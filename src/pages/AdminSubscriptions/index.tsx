
import React, { useEffect, useState } from 'react';
import { useSubscriptions } from './hooks/useSubscriptions';
import SubscriptionHeader from './components/SubscriptionHeader';
import SubscriptionTable from './components/SubscriptionTable';
import SubscriptionDialog from './components/SubscriptionDialog';
import { Subscription } from './types';

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

  const handleSubscriptionSubmit = (subscription: Subscription) => {
    // This will be implemented later
    console.log('Subscription submitted:', subscription);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <SubscriptionHeader onAddNew={handleAddNewClick} />
      
      <SubscriptionTable 
        subscriptions={subscriptions}
        loading={loading}
        onStatusChange={updateSubscriptionStatus}
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
