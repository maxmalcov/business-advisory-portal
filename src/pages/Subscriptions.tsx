
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Iframe, 
  Calendar, 
  Clock, 
  Users, 
  Info, 
  AlertCircle 
} from 'lucide-react';

type SubscriptionTool = {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  status: 'active' | 'pending' | 'rejected' | 'inactive';
  iframeUrl?: string;
  demoVideoUrl: string;
};

const Subscriptions: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedTool, setSelectedTool] = useState<SubscriptionTool | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  
  // Get user's iframe URLs from their profile
  const iframeUrls = user?.iframeUrls || [];
  
  // Mock subscription tools (would be fetched from backend in production)
  const subscriptionTools: SubscriptionTool[] = [
    {
      id: 'iframe1',
      name: 'IFRAME 1',
      icon: <Iframe className="h-6 w-6" />,
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
    
    // In production, this would send an API request to notify the admin
    toast({
      title: "Access Requested",
      description: `Your request for ${selectedTool?.name} has been sent to the administrator.`,
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">{t('nav.subscriptions')}</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('subscriptions.title')}</CardTitle>
          <CardDescription>{t('subscriptions.tools_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {subscriptionTools.map((tool) => (
              <Card 
                key={tool.id} 
                className="cursor-pointer hover:shadow-md transition-all"
                onClick={() => handleToolClick(tool)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      {tool.icon}
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(tool.status)}`}>
                      {tool.status.charAt(0).toUpperCase() + tool.status.slice(1)}
                    </div>
                  </div>
                  <CardTitle className="mt-2 text-lg">{tool.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{tool.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Slide-in panel for displaying tool content */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md md:max-w-lg lg:max-w-2xl overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle className="flex items-center">
              {selectedTool?.icon && <div className="mr-2">{selectedTool.icon}</div>}
              {selectedTool?.name}
              <div className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${selectedTool ? getStatusBadgeClass(selectedTool.status) : ''}`}>
                {selectedTool?.status.charAt(0).toUpperCase() + selectedTool?.status.slice(1)}
              </div>
            </SheetTitle>
            <SheetDescription>
              {selectedTool?.description}
            </SheetDescription>
          </SheetHeader>

          {selectedTool?.status === 'active' && selectedTool.iframeUrl ? (
            <iframe
              src={selectedTool.iframeUrl}
              className="w-full h-[calc(100vh-150px)] border-0 rounded"
              title={selectedTool.name}
              allowFullScreen
            />
          ) : (
            <div className="space-y-4">
              <div className="border rounded-md p-4 bg-yellow-50 flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Subscription Required</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    {selectedTool?.status === 'pending' 
                      ? 'Your access request is pending approval.' 
                      : selectedTool?.status === 'rejected'
                        ? 'Your access request has been rejected. Please contact support for more information.'
                        : 'You need to subscribe to access this tool.'}
                  </p>
                </div>
              </div>

              <div className="aspect-video bg-black rounded overflow-hidden">
                <iframe
                  src={selectedTool?.demoVideoUrl}
                  className="w-full h-full border-0"
                  title={`${selectedTool?.name} Demo`}
                  allowFullScreen
                />
              </div>
              
              <div className="flex justify-end">
                {(selectedTool?.status === 'inactive' || selectedTool?.status === 'rejected') && (
                  <Button onClick={() => setIsRequestDialogOpen(true)}>
                    Request Access
                  </Button>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Request Access Dialog */}
      <AlertDialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Request Access to {selectedTool?.name}</AlertDialogTitle>
            <AlertDialogDescription>
              This will send a notification to the administrator to review your request.
              You will be notified once your request has been processed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRequestAccess}>
              Submit Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Subscriptions;
