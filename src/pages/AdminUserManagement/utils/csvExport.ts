import { format } from 'date-fns';
import { UserInvoiceItem } from '../hooks/useUserActivity';

export const exportToCSV = (
  invoices: UserInvoiceItem[],
  userId: string,
  dateRange?: { from?: Date; to?: Date },
) => {
  // Prepare CSV headers
  const headers = ['Type', 'Filename', 'Upload Date'];
  const rows = [headers];

  // Add invoice data
  invoices.forEach((invoice) => {
    rows.push([
      (invoice as any).invoice_type,
      (invoice as any).file_name,
      format((invoice as any).created_at, 'yyyy-MM-dd HH:mm:ss'),
    ]);
  });

  // Convert to CSV string
  const csvContent = rows.map((row) => row.join(',')).join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const dateRangeStr =
    dateRange?.from && dateRange?.to
      ? `${format(dateRange.from, 'yyyy-MM-dd')}-to-${format(dateRange.to, 'yyyy-MM-dd')}`
      : 'all-time';

  link.href = URL.createObjectURL(blob);
  link.download = `user-invoices-${userId}-${dateRangeStr}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
