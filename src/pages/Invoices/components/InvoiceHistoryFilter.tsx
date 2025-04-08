
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface InvoiceHistoryFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterType: 'all' | 'sale' | 'supplier';
  setFilterType: (type: 'all' | 'sale' | 'supplier') => void;
}

const InvoiceHistoryFilter: React.FC<InvoiceHistoryFilterProps> = ({
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search invoices..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Tabs value={filterType} onValueChange={(v) => setFilterType(v as any)} className="sm:w-auto">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="sale">Sales</TabsTrigger>
          <TabsTrigger value="supplier">Supplier</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default InvoiceHistoryFilter;
