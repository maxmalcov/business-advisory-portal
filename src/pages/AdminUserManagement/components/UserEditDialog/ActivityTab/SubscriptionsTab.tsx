
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, BarChart } from 'lucide-react';
import { format } from 'date-fns';
import { UserSubscription, UserSubscriptionHistoryItem } from '../../../hooks/useUserActivity';

interface SubscriptionsTabProps {
  activeSubscription?: UserSubscription;
  subscriptionHistory: UserSubscriptionHistoryItem[];
}

const SubscriptionsTab: React.FC<SubscriptionsTabProps> = ({ 
  activeSubscription, 
  subscriptionHistory 
}) => {
  const formatDate = (date: Date): string => {
    return format(date, 'PPP'); // e.g., "April 10, 2024"
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <RefreshCw className="h-5 w-5 mr-2 text-primary" />
            Current Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeSubscription ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted p-4 rounded-md">
                  <div className="text-sm text-muted-foreground mb-1">Plan</div>
                  <div className="font-medium">{activeSubscription.name}</div>
                </div>
                <div className="bg-muted p-4 rounded-md">
                  <div className="text-sm text-muted-foreground mb-1">Status</div>
                  <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-100">
                    Active
                  </Badge>
                </div>
                <div className="bg-muted p-4 rounded-md">
                  <div className="text-sm text-muted-foreground mb-1">Period</div>
                  <div className="font-medium text-sm">
                    {formatDate(activeSubscription.startDate)} - {formatDate(activeSubscription.endDate)}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <span className="text-muted-foreground">No active subscription</span>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart className="h-5 w-5 mr-2 text-primary" />
            Subscription History
          </CardTitle>
          <CardDescription>Complete history of subscription activity</CardDescription>
        </CardHeader>
        <CardContent>
          {subscriptionHistory.length > 0 ? (
            <div className="border rounded-md">
              <div className="grid grid-cols-12 gap-4 px-4 py-3 font-medium bg-muted text-sm">
                <div className="col-span-3">Date</div>
                <div className="col-span-4">Plan</div>
                <div className="col-span-5">Action</div>
              </div>
              <div className="divide-y">
                {subscriptionHistory.map(item => (
                  <div key={`${item.id}-${item.action}`} className="grid grid-cols-12 gap-4 px-4 py-3 text-sm">
                    <div className="col-span-3">{formatDate(item.date)}</div>
                    <div className="col-span-4">{item.name}</div>
                    <div className="col-span-5">
                      <Badge 
                        variant="outline" 
                        className={
                          item.action === 'activated' 
                            ? "bg-green-50 text-green-600 hover:bg-green-100" 
                            : "bg-red-50 text-red-600 hover:bg-red-100"
                        }
                      >
                        {item.action === 'activated' ? 'Activated' : 'Cancelled'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <span className="text-muted-foreground">No subscription history</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionsTab;
