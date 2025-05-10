import React from 'react';
import { FileX } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface InvoiceHistoryEmptyStateProps {
  searchQuery: string;
  filterType: 'all' | 'sale' | 'supplier';
}

const InvoiceHistoryEmptyState: React.FC<InvoiceHistoryEmptyStateProps> = ({
  searchQuery,
  filterType,
}) => {
  const { language } = useLanguage();

  // Get messages based on current language
  const getMessages = () => {
    if (language === 'es') {
      return {
        title: 'No Se Encontraron Facturas',
        searchMessage:
          'No se encontraron facturas que coincidan con sus criterios de búsqueda.',
        filterMessage: (type: string) =>
          `No se encontraron facturas de ${type === 'sale' ? 'venta' : 'proveedores'}.`,
        defaultMessage: 'Aún no hay historial de facturas disponible.',
      };
    } else {
      return {
        title: 'No Invoices Found',
        searchMessage: 'No invoices found matching your search criteria.',
        filterMessage: (type: string) => `No ${type} invoices found.`,
        defaultMessage: 'No invoice history available yet.',
      };
    }
  };

  const messages = getMessages();

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted/50 p-4 rounded-full mb-4">
        <FileX className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{messages.title}</h3>
      <p className="text-muted-foreground max-w-md">
        {searchQuery
          ? messages.searchMessage
          : filterType !== 'all'
            ? messages.filterMessage(filterType)
            : messages.defaultMessage}
      </p>
    </div>
  );
};

export default InvoiceHistoryEmptyState;
