
import React from 'react';
import { Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InvoiceActionsProps } from './types';
import {useLanguage} from "@/context/LanguageContext.tsx";

export const InvoiceActions: React.FC<InvoiceActionsProps> = ({ 
  invoice, 
  onView, 
  onDownload 
}) => {
  const {t} = useLanguage()

  return (
    <div className="flex justify-end space-x-2">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => onView(invoice)}
        className="h-9"
      >
        <Eye className="h-4 w-4 mr-1" />
        <span className="sm:hidden">{t('invoices.search.table.mobile.view')}</span>
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => onDownload(invoice)}
        className="h-9"
      >
        <Download className="h-4 w-4 mr-1" />
        <span className="sm:hidden">{t('invoices.search.table.mobile.download')}</span>
      </Button>
    </div>
  );
};
