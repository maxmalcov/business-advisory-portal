import React, {useEffect, useState} from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Download } from 'lucide-react';
import { format } from 'date-fns';
import { UserInvoiceSummary } from '../../../hooks/useUserActivity';
import { DateFilter } from './DateFilter';
import { useDateFilter } from '../../../hooks/useDateFilter';
import { exportToCSV } from '../../../utils/csvExport';
import {supabase} from "@/integrations/supabase/client.ts";

interface InvoiceTabInterface {
  userId: string
}

const InvoicesTab: React.FC<InvoiceTabInterface> = ({userId} ) => {
  const {
    filterOption,
    setFilterOption,
    customDateRange,
    setCustomDateRange,
    currentDateRange,
    isWithinDateRange,
  } = useDateFilter('30days');
  const [invoices, setInvoices] = useState([])

  useEffect(() => {
    (async () => {
      const {data, error} = await supabase.from('invoice_files').select('*').eq('user_id', userId).order('created_at', { ascending: false });

      if(error){
        throw new Error('DB error')
      }

      setInvoices(data)
    })()
  }, [userId])

  const formatDate = (date: Date): string => {
    return format(date, 'PPP');
  };

  const filteredInvoices = invoices.filter((invoice) => {
        return isWithinDateRange( new Date(invoice.created_at.split('.')[0] + 'Z'))
      },
  );

  const handleExportCSV = () => {
    exportToCSV(filteredInvoices, 'user-id', currentDateRange);
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
              <div className="text-sm text-muted-foreground mb-1">
                Total Invoices
              </div>
              <div className="font-medium text-2xl">{invoices.length}</div>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <div className="text-sm text-muted-foreground mb-1">
                Sale Invoices
              </div>
              <div className="font-medium text-2xl">
                {invoices.filter(invoice => invoice.invoice_type == 'sale').length}
              </div>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <div className="text-sm text-muted-foreground mb-1">
                Supplier Invoices
              </div>
              <div className="font-medium text-2xl">
                {invoices.filter(invoice => invoice.invoice_type == 'supplier').length}
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium">Recent Invoices</h4>
                <DateFilter
                  filterOption={filterOption}
                  onFilterChange={setFilterOption}
                  customDateRange={customDateRange}
                  onCustomDateChange={setCustomDateRange}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                onClick={handleExportCSV}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>

            {filteredInvoices.length > 0 ? (
              <div className="border rounded-md">
                <div className="grid grid-cols-12 gap-4 px-4 py-3 font-medium bg-muted text-sm">
                  <div className="col-span-2">Type</div>
                  <div className="col-span-7">Filename</div>
                  <div className="col-span-3">Date</div>
                </div>
                <div className="divide-y">
                  {filteredInvoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="grid grid-cols-12 gap-4 px-4 py-3 text-sm"
                    >
                      <div className="col-span-2">
                        <Badge
                          variant="outline"
                          className={
                            invoice.invoice_type === 'sale'
                              ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                              : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                          }
                        >
                          {invoice.invoice_type === 'sale' ? 'Sale' : 'Supplier'}
                        </Badge>
                      </div>
                      <div
                        className="col-span-7 truncate"
                        title={invoice.fileName}
                      >
                        {invoice.fileName}
                      </div>
                      <div className="col-span-3">
                        {formatDate(invoice.created_at)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <span className="text-muted-foreground">
                  No recent invoices
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoicesTab;
