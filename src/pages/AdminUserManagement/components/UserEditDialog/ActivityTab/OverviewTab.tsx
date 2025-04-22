
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Package, RefreshCw, FileText, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { UserActivityData } from '../../../hooks/useUserActivity';

export interface OverviewTabProps {
  data: UserActivityData;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ data }) => {
  const formatDate = (date: Date): string => {
    return format(date, 'PPP'); // e.g., "April 10, 2024"
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Registration Info */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <User className="h-5 w-5 mr-2 text-primary" />
              Registration Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Registration Date:</span>
                <span className="ml-2 font-medium">{formatDate(data.registrationInfo.registrationDate)}</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Registration Time:</span>
                <span className="ml-2 font-medium">{format(data.registrationInfo.registrationDate, 'p')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Package className="h-5 w-5 mr-2 text-primary" />
              Services Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Services:</span>
                <span className="font-medium">{data.services.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Completed:</span>
                <span className="font-medium">{data.services.filter(s => s.status === 'completed').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">In Progress:</span>
                <span className="font-medium">{data.services.filter(s => s.status === 'in-progress').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Cancelled:</span>
                <span className="font-medium">{data.services.filter(s => s.status === 'cancelled').length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current Subscription */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <RefreshCw className="h-5 w-5 mr-2 text-primary" />
              Current Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.subscriptions.active ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Plan:</span>
                  <span className="font-medium">{data.subscriptions.active.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-100">
                    Active
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Period:</span>
                  <span className="font-medium text-sm">
                    {formatDate(data.subscriptions.active.startDate)} - {formatDate(data.subscriptions.active.endDate)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-2">
                <span className="text-muted-foreground">No active subscription</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Invoice Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              Invoices Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Invoices:</span>
                <span className="font-medium">{data.invoices.totalCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Sale Invoices:</span>
                <span className="font-medium">{data.invoices.saleInvoices}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Supplier Invoices:</span>
                <span className="font-medium">{data.invoices.supplierInvoices}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;
