
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import DocumentStats from './DocumentStats';
import MonthlyComparison from './MonthlyComparison';

interface DocumentsTabProps {
  invoiceStats: {
    total: number;
    sales: number;
    supplier: number;
    thisMonth: number;
    lastMonth: number;
  };
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ invoiceStats }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Summary</CardTitle>
        <CardDescription>
          Overview of your documents and invoices
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <DocumentStats invoiceStats={invoiceStats} />
          <MonthlyComparison 
            thisMonth={invoiceStats.thisMonth} 
            lastMonth={invoiceStats.lastMonth} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentsTab;
