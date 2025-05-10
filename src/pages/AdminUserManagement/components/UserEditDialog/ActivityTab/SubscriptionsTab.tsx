import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { RefreshCw, BarChart } from 'lucide-react';
import { useIframeSubscriptions } from '../../../hooks/useIframeSubscriptions';
import SubscriptionItem from './SubscriptionItem';
import SubscriptionHistory from './SubscriptionHistory';
import { User } from '../../../hooks/types';

interface SubscriptionsTabProps {
  user: User;
}

const SubscriptionsTab: React.FC<SubscriptionsTabProps> = ({ user }) => {
  const {
    subscriptions,
    history,
    loading,
    toggleSubscriptionStatus,
    updateSubscriptionPeriod,
    formatDate,
  } = useIframeSubscriptions(user);

  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<
    string | undefined
  >();

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-muted rounded animate-pulse"></div>
        <div className="h-40 bg-muted rounded animate-pulse"></div>
        <div className="h-40 bg-muted rounded animate-pulse"></div>
      </div>
    );
  }

  const handleTabChange = (tab: string) => {
    // If "All" is selected, clear the filter; otherwise set the subscription ID
    setSelectedSubscriptionId(tab === 'all' ? undefined : tab);
  };

  return (
    <div className="space-y-6">
      {/*<Card>*/}
      {/*  <CardHeader className="pb-2">*/}
      {/*    <CardTitle className="flex items-center text-xl">*/}
      {/*      <RefreshCw className="h-5 w-5 mr-2 text-primary" />*/}
      {/*      Iframe Subscriptions*/}
      {/*    </CardTitle>*/}
      {/*    <CardDescription>*/}
      {/*      Manage active iframe-based subscriptions for this user*/}
      {/*    </CardDescription>*/}
      {/*  </CardHeader>*/}
      {/*  <CardContent>*/}
      {/*    <div className="space-y-4">*/}
      {/*      {subscriptions.map((subscription) => (*/}
      {/*        <SubscriptionItem*/}
      {/*          key={subscription.id}*/}
      {/*          subscription={subscription}*/}
      {/*          onToggleStatus={toggleSubscriptionStatus}*/}
      {/*          onUpdatePeriod={updateSubscriptionPeriod}*/}
      {/*          formatDate={formatDate}*/}
      {/*        />*/}
      {/*      ))}*/}
      {/*    </div>*/}
      {/*  </CardContent>*/}
      {/*</Card>*/}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-xl">
            <BarChart className="h-5 w-5 mr-2 text-primary" />
            Subscription History
          </CardTitle>
          <CardDescription>
            Complete history of subscription activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={handleTabChange}>
            {/*<TabsList className="mb-4">*/}
            {/*  <TabsTrigger value="all">All Changes</TabsTrigger>*/}
            {/*  {subscriptions.map((subscription) => (*/}
            {/*    <TabsTrigger key={subscription.id} value={subscription.id}>*/}
            {/*      {subscription.name}*/}
            {/*    </TabsTrigger>*/}
            {/*  ))}*/}
            {/*</TabsList>*/}

            <TabsContent value="all" className="mt-0">
              <SubscriptionHistory userId={user.id} />
            </TabsContent>

            {/*{subscriptions.map((subscription) => (*/}
            {/*  <TabsContent*/}
            {/*    key={subscription.id}*/}
            {/*    value={subscription.id}*/}
            {/*    className="mt-0"*/}
            {/*  >*/}
            {/*    <SubscriptionHistory*/}
            {/*      userId={user.id}*/}
            {/*      selectedSubscriptionId={subscription.id}*/}
            {/*    />*/}
            {/*  </TabsContent>*/}
            {/*))}*/}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionsTab;
