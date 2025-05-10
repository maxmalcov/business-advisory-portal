import React from 'react';
import { DateFilter } from '@/pages/AdminUserManagement/components/UserEditDialog/ActivityTab/DateFilter';
import {
  DateFilterOption,
  DateRange,
} from '@/pages/AdminUserManagement/hooks/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FilterInput } from '@/pages/HR/components/FilterInput';
import { Download } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface InvoiceFiltersProps {
  filterOption: DateFilterOption;
  onFilterChange: (option: DateFilterOption) => void;
  customDateRange: DateRange;
  onCustomDateChange: (range: DateRange) => void;
  userFilter: string;
  onUserFilterChange: (value: string) => void;
  typeFilter: 'all' | 'sales' | 'supplier';
  onTypeFilterChange: (value: 'all' | 'sales' | 'supplier') => void;
  users: { id: string; name: string; email: string }[];
  onExport: () => void;
  totalItems: number;
}

const InvoiceFilters: React.FC<InvoiceFiltersProps> = ({
  filterOption,
  onFilterChange,
  customDateRange,
  onCustomDateChange,
  userFilter,
  onUserFilterChange,
  typeFilter,
  onTypeFilterChange,
  users,
  onExport,
  totalItems,
}) => {
  const { language } = useLanguage();

  const getTexts = () => {
    if (language === 'es') {
      return {
        invoiceRecords: 'Registros de Facturas',
        exportCSV: 'Exportar CSV',
        searchPlaceholder: 'Buscar por nombre de usuario o correo electrónico',
        selectType: 'Seleccionar tipo de factura',
        allTypes: 'Todos los tipos',
        salesInvoices: 'Facturas de Venta',
        supplierInvoices: 'Facturas de Proveedores',
        showing: 'Mostrando',
        invoice: 'factura',
        invoices: 'facturas',
        matching: 'coincidentes con el filtro',
      };
    } else {
      return {
        invoiceRecords: 'Invoice Records',
        exportCSV: 'Export CSV',
        searchPlaceholder: 'Search by user name or email',
        selectType: 'Select invoice type',
        allTypes: 'All Types',
        salesInvoices: 'Sales Invoices',
        supplierInvoices: 'Supplier Invoices',
        showing: 'Showing',
        invoice: 'invoice',
        invoices: 'invoices',
        matching: 'matching filter',
      };
    }
  };

  const texts = getTexts();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h3 className="text-lg font-medium">{texts.invoiceRecords}</h3>
        <Button
          onClick={onExport}
          variant="outline"
          className="flex items-center gap-2"
          disabled={totalItems === 0}
        >
          <Download className="h-4 w-4" />
          {texts.exportCSV}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DateFilter
          filterOption={filterOption}
          onFilterChange={onFilterChange}
          customDateRange={customDateRange}
          onCustomDateChange={onCustomDateChange}
        />

        <FilterInput
          value={userFilter}
          onChange={onUserFilterChange}
          placeholder={texts.searchPlaceholder}
          className="w-full"
        />

        <Select
          value={typeFilter}
          onValueChange={(value) =>
            onTypeFilterChange(value as 'all' | 'sales' | 'supplier')
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={texts.selectType} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{texts.allTypes}</SelectItem>
            <SelectItem value="sales">{texts.salesInvoices}</SelectItem>
            <SelectItem value="supplier">{texts.supplierInvoices}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="text-sm text-muted-foreground">
        {texts.showing} {totalItems}{' '}
        {totalItems === 1 ? texts.invoice : texts.invoices}{' '}
        {userFilter && texts.matching}
      </div>
    </div>
  );
};

export default InvoiceFilters;
