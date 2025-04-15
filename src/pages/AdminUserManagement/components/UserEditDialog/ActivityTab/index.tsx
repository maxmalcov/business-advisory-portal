
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUserActivity } from '../../../hooks/useUserActivity';
import ActivitySkeleton from './ActivitySkeleton';
import OverviewTab from './OverviewTab';
import ServicesTab from './ServicesTab';
import SubscriptionsTab from './SubscriptionsTab';
import InvoicesTab from './InvoicesTab';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';

interface ActivityTabContentProps {
  userId: string;
}

const ActivityTabContent: React.FC<ActivityTabContentProps> = ({ userId }) => {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const { activityData, isLoading, error } = useUserActivity(userId);
  
  // If the current user is not an admin and trying to view someone else's data
  const isUnauthorized = !isLoading && currentUser && 
                         currentUser.userType !== 'admin' && 
                         currentUser.id !== userId;

  if (isUnauthorized) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertDescription>
            You do not have permission to view this user's activity data.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <ActivitySkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!activityData) {
    return (
      <div className="p-6">
        <Alert>
          <AlertDescription>No activity data available for this user.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 border-b">
          <TabsList className="gap-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent 
          value="overview" 
          className="flex-1 flex flex-col data-[state=active]:flex data-[state=inactive]:hidden overflow-hidden"
        >
          <ScrollArea className="flex-1 px-6 py-4">
            <OverviewTab data={activityData} />
          </ScrollArea>
        </TabsContent>
        
        <TabsContent 
          value="services" 
          className="flex-1 flex flex-col data-[state=active]:flex data-[state=inactive]:hidden overflow-hidden"
        >
          <ScrollArea className="flex-1 px-6 py-4">
            <ServicesTab services={activityData.services} />
          </ScrollArea>
        </TabsContent>
        
        <TabsContent 
          value="subscriptions" 
          className="flex-1 flex flex-col data-[state=active]:flex data-[state=inactive]:hidden overflow-hidden"
        >
          <ScrollArea className="flex-1 px-6 py-4">
            <SubscriptionsTab 
              activeSubscription={activityData.subscriptions.active}
              subscriptionHistory={activityData.subscriptions.history}
            />
          </ScrollArea>
        </TabsContent>
        
        <TabsContent 
          value="invoices" 
          className="flex-1 flex flex-col data-[state=active]:flex data-[state=inactive]:hidden overflow-hidden"
        >
          <ScrollArea className="flex-1 px-6 py-4">
            <InvoicesTab invoices={activityData.invoices} />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ActivityTabContent;
