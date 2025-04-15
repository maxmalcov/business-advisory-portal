
import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { XCircle } from 'lucide-react';
import { useUserActivity } from '../../../hooks/useUserActivity';
import OverviewTab from './OverviewTab';
import ServicesTab from './ServicesTab';
import SubscriptionsTab from './SubscriptionsTab';
import InvoicesTab from './InvoicesTab';
import ActivitySkeleton from './ActivitySkeleton';

interface ActivityTabContentProps {
  userId: string;
}

const ActivityTabContent: React.FC<ActivityTabContentProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const { activityData, isLoading, error } = useUserActivity(userId);
  
  useEffect(() => {
    console.log("Activity Tab Content for user:", userId);
    console.log("Activity data loaded:", activityData !== null);
    if (activityData) {
      console.log("Invoices count:", activityData.invoices.totalCount);
    }
  }, [userId, activityData]);
  
  if (isLoading) {
    return (
      <ScrollArea className="flex-1 px-6 pb-4 pt-4">
        <ActivitySkeleton />
      </ScrollArea>
    );
  }
  
  if (error || !activityData) {
    return (
      <ScrollArea className="flex-1 px-6 pb-4 pt-4">
        <Card>
          <CardContent className="pt-6 pb-6 text-center">
            <XCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
            <p>{error || "Failed to load activity data"}</p>
            <p className="text-sm text-muted-foreground mt-1">Please try again later</p>
          </CardContent>
        </Card>
      </ScrollArea>
    );
  }
  
  return (
    <ScrollArea className="flex-1 px-6 pb-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview">
          <OverviewTab data={activityData} />
        </TabsContent>
        
        {/* Services Tab */}
        <TabsContent value="services">
          <ServicesTab services={activityData.services} />
        </TabsContent>
        
        {/* Subscriptions Tab */}
        <TabsContent value="subscriptions">
          <SubscriptionsTab 
            activeSubscription={activityData.subscriptions.active} 
            subscriptionHistory={activityData.subscriptions.history} 
          />
        </TabsContent>
        
        {/* Invoices Tab */}
        <TabsContent value="invoices">
          <InvoicesTab invoices={activityData.invoices} />
        </TabsContent>
      </Tabs>
    </ScrollArea>
  );
};

export default ActivityTabContent;
