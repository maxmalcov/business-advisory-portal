import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Package,
  FileText,
  Calendar,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { format } from 'date-fns';
import { UserActivityData } from '../../../hooks/useUserActivity';
// import SubscriptionOverview from './SubscriptionOverview';

export interface OverviewTabProps {
  data: UserActivityData;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ data }) => {
  const formatDate = (date: Date): string => {
    return format(date, 'PPP');
  };

  return (
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
              <span className="ml-2 font-medium">
                {formatDate(data.registrationInfo.registrationDate)}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">Registration Time:</span>
              <span className="ml-2 font-medium">
                {format(data.registrationInfo.registrationDate, 'p')}
              </span>
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
              <span className="text-sm text-muted-foreground">
                Total Services:
              </span>
              <span className="font-medium">{data.services.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Completed:</span>
              <span className="font-medium">
                {data.services.filter((s) => s.status === 'completed').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Pending:
              </span>
              <span className="font-medium">
                {data.services.filter((s) => s.status === 'pending').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Rejected:</span>
              <span className="font-medium">
                {data.services.filter((s) => s.status === 'rejected').length}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Overview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <RefreshCw className="h-5 w-5 mr-2 text-primary" />
            Active Subscriptions:
          </CardTitle>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total:</span>
            <span className="font-medium">
                {data.subscriptions.total}
              </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Active:</span>
            <span className="font-medium">
                {data.subscriptions.active}
              </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Pending:</span>
            <span className="font-medium">
                {data.subscriptions.pending}
              </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Rejected:</span>
            <span className="font-medium">
                {data.subscriptions.rejected}
              </span>
          </div>
        </CardHeader>
        <CardContent>
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
              <span className="text-sm text-muted-foreground">
                Total Invoices:
              </span>
              <span className="font-medium">{data.invoices.totalCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Sale Invoices:
              </span>
              <span className="font-medium">{data.invoices.saleInvoices}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Supplier Invoices:
              </span>
              <span className="font-medium">
                {data.invoices.supplierInvoices}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;
