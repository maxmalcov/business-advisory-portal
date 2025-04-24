
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { useIframeSubscriptions } from '../../../hooks/useIframeSubscriptions';
import SubscriptionItem from './SubscriptionItem';
import { User } from '../../../hooks/types';

interface SubscriptionsTabProps {
  user: User;
}

const SubscriptionsTab: React.FC<SubscriptionsTabProps> = ({ user }) => {
  const {
    subscriptions,
    loading,
    toggleSubscriptionStatus,
    updateSubscriptionPeriod,
    formatDate
  } = useIframeSubscriptions(user);
  
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-muted rounded animate-pulse"></div>
        <div className="h-40 bg-muted rounded animate-pulse"></div>
        <div className="h-40 bg-muted rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-xl">
            <RefreshCw className="h-5 w-5 mr-2 text-primary" />
            Iframe Subscriptions
          </CardTitle>
          <CardDescription>
            Manage active iframe-based subscriptions for this user
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subscriptions.map(subscription => (
              <SubscriptionItem
                key={subscription.id}
                subscription={subscription}
                onToggleStatus={toggleSubscriptionStatus}
                onUpdatePeriod={updateSubscriptionPeriod}
                formatDate={formatDate}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionsTab;

