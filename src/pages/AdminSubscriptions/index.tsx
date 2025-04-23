
import React, { useEffect } from 'react';
import { useSubscriptions } from './hooks/useSubscriptions';
import SubscriptionHeader from './components/SubscriptionHeader';
import SubscriptionTable from './components/SubscriptionTable';
import SubscriptionDialog from './components/SubscriptionDialog';

const AdminSubscriptions = () => {
  const { 
    subscriptions, 
    loading, 
    fetchSubscriptions,
    updateSubscriptionStatus
  } = useSubscriptions();

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return (
    <div className="space-y-6">
      <SubscriptionHeader onAddNew={() => {}} />
      
      <SubscriptionTable 
        subscriptions={subscriptions}
        loading={loading}
        onStatusChange={updateSubscriptionStatus}
      />

      <SubscriptionDialog
        isOpen={false}
        onOpenChange={() => {}}
        onSubmit={() => {}}
      />
    </div>
  );
};

export default AdminSubscriptions;
