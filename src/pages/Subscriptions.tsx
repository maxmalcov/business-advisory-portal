
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Sheet } from "@/components/ui/sheet";
import { Frame, Calendar, Clock, Users } from 'lucide-react';
import { SubscriptionTool } from '@/types/subscriptions';
import SubscriptionCard from '@/components/subscriptions/SubscriptionCard';
import SubscriptionSheetContent from '@/components/subscriptions/SubscriptionSheetContent';
import RequestAccessDialog from '@/components/subscriptions/RequestAccessDialog';
import SubscriptionsHeader from './Subscriptions/components/SubscriptionsHeader';

const Subscriptions: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedTool, setSelectedTool] = useState<SubscriptionTool | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  
  const iframeUrls = user?.iframeUrls || [];
  
  const subscriptionTools: SubscriptionTool[] = [
    {
      id: 'iframe1',
      name: 'IFRAME 1',
      icon: <Frame className="h-6 w-6" />,
      description: 'Access your custom dashboard with real-time data',
      status: 'active',
      iframeUrl: iframeUrls[0] || '',
      demoVideoUrl: 'https://pbaholding-my.sharepoint.com/...'
    },
    {
      id: 'iframe2',
      name: 'IFRAME 2',
      icon: <Calendar className="h-6 w-6" />,
      description: 'Schedule and manage your calendar events',
      status: 'pending',
      iframeUrl: iframeUrls[1] || '',
      demoVideoUrl: 'https://pbaholding-my.sharepoint.com/...'
    },
    {
      id: 'crm',
      name: 'CRM',
      icon: <Users className="h-6 w-6" />,
      description: 'Customer relationship management tool',
      status: 'inactive',
      demoVideoUrl: 'https://start.exactonline.es/...'
    },
    {
      id: 'time-tracking',
      name: 'Time Tracking',
      icon: <Clock className="h-6 w-6" />,
      description: 'Track and manage your work hours',
      status: 'rejected',
      demoVideoUrl: 'https://www.youtube.com/embed/MuNyfqxAO6Y'
    }
  ];

  const handleToolClick = (tool: SubscriptionTool) => {
    setSelectedTool(tool);
    setIsSheetOpen(true);
  };

  const handleRequestAccess = () => {
    setIsRequestDialogOpen(false);
    
    toast({
      title: "Access Requested",
      description: `Your request for ${selectedTool?.name} has been sent to the administrator.`,
    });
  };

  return (
    <div className="space-y-6">
      <SubscriptionsHeader />
      
      <Card>
        <CardHeader>
          <CardDescription>{t('subscriptions.tools_description')}</CardDescription>
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
