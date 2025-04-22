
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw } from 'lucide-react';
import { IframeSubscription } from '../../../hooks/types';

interface SubscriptionOverviewProps {
  subscriptions: IframeSubscription[];
}

const SubscriptionOverview: React.FC<SubscriptionOverviewProps> = ({ subscriptions }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <RefreshCw className="h-5 w-5 mr-2 text-primary" />
          Active Subscriptions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subscriptions.map((subscription) => (
            <div 
              key={subscription.id} 
              className="p-4 rounded-lg border bg-card"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{subscription.name}</h3>
                <Badge 
                  variant="outline" 
                  className={`
                    ${subscription.status === 'active' 
                      ? 'bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700' 
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-700'}
                  `}
                >
                  {subscription.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              {subscription.status === 'active' && (
                <div className="text-sm text-muted-foreground">
                  {subscription.isLifetime ? (
                    <span>Lifetime Access</span>
                  ) : (
                    <span>
                      Valid until: {subscription.endDate 
                        ? new Date(subscription.endDate).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : 'No expiration'
                      }
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionOverview;
