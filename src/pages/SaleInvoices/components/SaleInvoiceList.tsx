
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockSaleInvoices } from '../mockData';

const SaleInvoiceList: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('invoices.history')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">{t('invoices.date')}</th>
                <th className="px-4 py-2 text-left">{t('invoices.filename')}</th>
                <th className="px-4 py-2 text-left">{t('invoices.type')}</th>
                <th className="px-4 py-2 text-left">{t('invoices.status')}</th>
              </tr>
            </thead>
            <tbody>
              {mockSaleInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b hover:bg-muted/50">
                  <td className="px-4 py-2">{invoice.date}</td>
                  <td className="px-4 py-2">{invoice.filename}</td>
                  <td className="px-4 py-2">{invoice.type}</td>
                  <td className="px-4 py-2">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      invoice.status === 'processed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invoice.status === 'processed' 
                        ? t('invoices.status_processed') 
                        : t('invoices.status_pending')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SaleInvoiceList;
