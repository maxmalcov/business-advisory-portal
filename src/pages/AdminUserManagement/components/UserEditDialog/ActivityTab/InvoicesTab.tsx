
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText } from 'lucide-react';
import { format } from 'date-fns';
import { UserInvoiceSummary } from '../../../hooks/useUserActivity';

interface InvoicesTabProps {
  invoices: UserInvoiceSummary;
}

const InvoicesTab: React.FC<InvoicesTabProps> = ({ invoices }) => {
  const formatDate = (date: Date): string => {
    return format(date, 'PPP'); // e.g., "April 10, 2024"
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-primary" />
            Invoices Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted p-4 rounded-md">
              <div className="text-sm text-muted-foreground mb-1">Total Invoices</div>
              <div className="font-medium text-2xl">{invoices.totalCount}</div>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <div className="text-sm text-muted-foreground mb-1">Sale Invoices</div>
              <div className="font-medium text-2xl">{invoices.saleInvoices}</div>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <div className="text-sm text-muted-foreground mb-1">Supplier Invoices</div>
              <div className="font-medium text-2xl">{invoices.supplierInvoices}</div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Recent Invoices</h4>
              <Badge variant="outline">Last 30 days</Badge>
            </div>
            
            {invoices.recentInvoices.length > 0 ? (
              <div className="border rounded-md">
                <div className="grid grid-cols-12 gap-4 px-4 py-3 font-medium bg-muted text-sm">
                  <div className="col-span-2">Type</div>
                  <div className="col-span-7">Filename</div>
                  <div className="col-span-3">Date</div>
                </div>
                <div className="divide-y">
                  {invoices.recentInvoices.map(invoice => (
                    <div key={invoice.id} className="grid grid-cols-12 gap-4 px-4 py-3 text-sm">
                      <div className="col-span-2">
                        <Badge 
                          variant="outline" 
                          className={
                            invoice.type === 'sale' 
                              ? "bg-blue-50 text-blue-600 hover:bg-blue-100" 
                              : "bg-amber-50 text-amber-600 hover:bg-amber-100"
                          }
                        >
                          {invoice.type === 'sale' ? 'Sale' : 'Supplier'}
                        </Badge>
                      </div>
                      <div className="col-span-7 truncate" title={invoice.fileName}>
                        {invoice.fileName}
                      </div>
                      <div className="col-span-3">{formatDate(invoice.date)}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <span className="text-muted-foreground">No recent invoices</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoicesTab;
