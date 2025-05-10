import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface DocumentStatsProps {
  invoiceStats: {
    total: number;
    sales: number;
    supplier: number;
    thisMonth: number;
  };
}

const DocumentStats: React.FC<DocumentStatsProps> = ({ invoiceStats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{invoiceStats.total}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Sales Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{invoiceStats.sales}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Supplier Invoices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{invoiceStats.supplier}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{invoiceStats.thisMonth}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentStats;
