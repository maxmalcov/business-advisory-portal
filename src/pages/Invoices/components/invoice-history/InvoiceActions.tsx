
import React from 'react';
import { Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InvoiceActionsProps } from './types';

export const InvoiceActions: React.FC<InvoiceActionsProps> = ({ 
  invoice, 
  onView, 
  onDownload 
}) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => onView(invoice)}
        className="h-9"
      >
        <Eye className="h-4 w-4 mr-1" />
        <span className="sm:hidden">View</span>
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => onDownload(invoice)}
        className="h-9"
      >
        <Download className="h-4 w-4 mr-1" />
        <span className="sm:hidden">Download</span>
      </Button>
    </div>
  );
};
