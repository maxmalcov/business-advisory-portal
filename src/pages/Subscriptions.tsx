import React, {useEffect, useState} from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Sheet } from "@/components/ui/sheet";
import { SubscriptionTool } from '@/types/subscriptions';
import SubscriptionCard from '@/components/subscriptions/SubscriptionCard';
import SubscriptionSheetContent from '@/components/subscriptions/SubscriptionSheetContent';
import RequestAccessDialog from '@/components/subscriptions/RequestAccessDialog';
import SubscriptionsHeader from './Subscriptions/components/SubscriptionsHeader';
import {
  notificationSettingsTable,
  subscriptionRequestsTable,
  subscriptionTypeTable,
  supabase
} from '@/integrations/supabase/client';
import {SubscriptionType} from "@/pages/AdminSubscriptionCatalog/hooks/useSubscriptionTypes.tsx";
import {sendEmail} from "@/integrations/email";
import {log} from "@/utils/logs/log.funciton.ts";

const Subscriptions: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();

  const [selectedTool, setSelectedTool] = useState<SubscriptionTool | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);

  const demoVideoUrl = 'https://www.youtube.com/embed/2e_z7y3_m00'

  const iframeUrls = user?.iframeUrls || [];

  const [subscriptionTypes, setSubscriptionTypes] = useState<SubscriptionType[]>([]);
  const [subscriptionRequests, setSubscriptionRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: typesData, error: typesError } = await subscriptionTypeTable().select('*');
      if (!typesError && typesData) {
        setSubscriptionTypes(typesData as any);
      }

      const { data: requestData, error: requestError } = await subscriptionRequestsTable()
          .select('*')
          .eq('user_id', user.id);
      if(requestError){
        console.error(requestError)
      }
      setSubscriptionRequests(requestData);
    };

    fetchData();
  }, []);

  let counter = 0
  for (let i = 0; i < subscriptionRequests.length; i++){
    if(subscriptionRequests[i].status == 'active'){
      subscriptionRequests[i].iframe_url = iframeUrls[counter] || ''
      counter++
    }
  }

  const subscriptionTools: SubscriptionTool[] = []

  if(subscriptionRequests.length != 0){

    for (let i = 0; i < subscriptionTypes.length; i++) {
      const newSubscription: any = {
        demoVideoUrl,
        id: subscriptionTypes[i].id,
        name: subscriptionTypes[i].name,
        description: subscriptionTypes[i].description,
        icon: subscriptionTypes[i].icon_type,
      }

      const request = subscriptionRequests.find(item => item.tool_id == subscriptionTypes[i].id)

      if (request) {
        if (request.status == 'active') {
          newSubscription.iframeUrl = request.iframe_url
          newSubscription.status = 'active'
        } else {
          newSubscription.iframeUrl = ''
          newSubscription.status = request.status
        }
      } else {
        newSubscription.iframeUrl = ''
        newSubscription.status = 'inactive'
      }
      subscriptionTools.push(newSubscription)
    }
  }

  const handleToolClick = (tool: SubscriptionTool) => {
    setSelectedTool(tool);
    setIsSheetOpen(true);
  };

  const handleRequestAccess = async () => {
    setIsRequestDialogOpen(false);
    
    if (!selectedTool) return;
    
    try {
      const { data , error } = await notificationSettingsTable()
          .select('email')
          .eq('category', 'subscriptions')
          .maybeSingle();

      const { error: notificationError } = await supabase.functions.invoke('notify-admin-subscription-request', {
        body: {
          clientName: user?.name || user?.email || 'Unknown User',
          subscriptionName: selectedTool.name
        }
      });

      if(selectedTool.status == 'inactive'){
        const {error: dbError} = await subscriptionRequestsTable().insert({
          user_id: user.id,
          tool_id: selectedTool.id,
          tool_name: selectedTool.name,
        })

        if (dbError) {
          throw new Error('Request already exists')
        }
      } else {
        const {error: dbError} = await subscriptionRequestsTable().update({
            status: 'pending'
        }).eq('user_id', user.id)
            .eq('tool_id', selectedTool.id);

        if (dbError) {
          throw new Error('Server error')
        }
      }

      sendEmail((data as any).email, 'Subscription request', `A client has submitted a new subscription request.

Client Name: ${user?.name || user?.email || 'Unknown User'}
Subscription Requested: ${selectedTool.name}

You can manage this request in the admin dashboard.`)

      log({ action: 'Subscription request', description: `New subscriptoin request ${selectedTool.name} from ${user?.name || user?.email || 'Unknown User'}`, category: 'subscription', user: user.email, level: 'info'})

      if (notificationError) {
        console.error('Error sending notification:', notificationError);
        toast({
          title: t('subscriptions.requests.toast.failed.title'),
          description: t('subscriptions.requests.toast.failed.description'),
          variant: "destructive"
        });
      }
      
      toast({
        title: t('subscriptions.requests.toast.success.title'),
        description: t('subscriptions.requests.toast.success.description'),
      });
    } catch (error) {
      console.error('Error handling subscription request:', error);
      toast({
        title: t('subscriptions.requests.toast.failed.title'),
        description: t('subscriptions.requests.toast.failed.description'),
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <SubscriptionsHeader />
      
      <Card>
        <CardHeader>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {subscriptionTools.map((tool) => (
              <SubscriptionCard 
                key={tool.id} 
                tool={tool} 
                onClick={handleToolClick} 
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SubscriptionSheetContent 
          selectedTool={selectedTool} 
          onRequestAccess={() => setIsRequestDialogOpen(true)}
        />
      </Sheet>

      <RequestAccessDialog 
        isOpen={isRequestDialogOpen}
        onOpenChange={setIsRequestDialogOpen}
        onConfirm={handleRequestAccess}
        selectedTool={selectedTool}
      />
    </div>
  );
};

export default Subscriptions;
