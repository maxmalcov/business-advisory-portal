
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUserActivity } from '../../../hooks/useUserActivity';
import OverviewTab from './OverviewTab';
import ServicesTab from './ServicesTab';
import SubscriptionsTab from './SubscriptionsTab';
import InvoicesTab from './InvoicesTab';
import ActivitySkeleton from './ActivitySkeleton';
import { useUserManagement } from '../../../hooks/useUserManagement';

interface ActivityTabContentProps {
  userId: string;
}

const ActivityTabContent: React.FC<ActivityTabContentProps> = ({ userId }) => {
  const { users } = useUserManagement();
  const { activityData, isLoading, error } = useUserActivity(userId);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Find the user in the users array
  const user = users.find(u => u.id === userId);
  
  if (isLoading) {
    return <ActivitySkeleton />;
  }
  
  if (error || !activityData) {
    return (
      <div className="p-6 text-center">
        <p className="text-destructive">Error loading user activity data.</p>
        <p className="text-muted-foreground text-sm mt-2">{error}</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <OverviewTab data={activityData} />
        </TabsContent>
        
        <TabsContent value="services" className="space-y-4">
          <ServicesTab services={activityData.services} />
        </TabsContent>
        
        <TabsContent value="subscriptions" className="space-y-4">
          {user ? (
            <SubscriptionsTab user={user} />
          ) : (
            <p className="text-muted-foreground text-center py-8">User data not available.</p>
          )}
        </TabsContent>
        
        <TabsContent value="invoices" className="space-y-4">
          <InvoicesTab invoices={activityData.invoices} />
        </TabsContent>
      </Tabs>
    </ScrollArea>
  );
};

export default ActivityTabContent;
