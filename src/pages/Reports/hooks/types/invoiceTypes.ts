export interface InvoiceItem {
  id: string;
  fileName: string;
  type: 'sales' | 'supplier';
  date: Date;
  size: number;
  path: string;
  userName: string;
  userEmail: string;
  userId: string;
}

export interface InvoiceFilters {
  userFilter: string;
  typeFilter: 'all' | 'sales' | 'supplier';
  dateRange: {
    from?: Date;
    to?: Date;
  };
}
