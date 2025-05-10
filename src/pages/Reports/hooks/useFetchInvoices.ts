import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { InvoiceItem } from './types/invoiceTypes';

export const useFetchInvoices = () => {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [users, setUsers] = useState<
    { id: string; name: string; email: string }[]
  >([]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const [salesResponse, supplierResponse] = await Promise.all([
        supabase.from('invoice_files').select('*').eq('invoice_type', 'sale'),
        supabase
          .from('invoice_files')
          .select('*')
          .eq('invoice_type', 'supplier'),
      ]);

      const { data: userData } = await supabase
        .from('profiles')
        .select('id, name, email');

      const userMap = new Map();
      if (userData) {
        userData.forEach((user) => {
          userMap.set(user.id, {
            name: user.name || 'Unknown',
            email: user.email || 'Unknown',
          });
        });
        setUsers(userData);
      }

      const allInvoices: InvoiceItem[] = [];

      if (salesResponse.data) {
        const salesInvoices = salesResponse.data.map((invoice) => {
          const userInfo = userMap.get(invoice.user_id) || {
            name: 'Unknown',
            email: 'Unknown',
          };
          return {
            id: invoice.id,
            fileName: invoice.file_name,
            type: 'sales' as const,
            date: new Date(invoice.created_at),
            size: invoice.file_size,
            path: invoice.storage_path,
            userName: userInfo.name,
            userEmail: userInfo.email,
            userId: invoice.user_id,
          };
        });
        allInvoices.push(...salesInvoices);
      }

      if (supplierResponse.data) {
        const supplierInvoices = supplierResponse.data.map((invoice) => {
          const userInfo = userMap.get(invoice.user_id) || {
            name: 'Unknown',
            email: 'Unknown',
          };
          return {
            id: invoice.id,
            fileName: invoice.file_name,
            type: 'supplier' as const,
            date: new Date(invoice.created_at),
            size: invoice.file_size,
            path: invoice.storage_path,
            userName: userInfo.name,
            userEmail: userInfo.email,
            userId: invoice.user_id,
          };
        });
        allInvoices.push(...supplierInvoices);
      }

      allInvoices.sort((a, b) => b.date.getTime() - a.date.getTime());
      setInvoices(allInvoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    invoices,
    users,
    loading,
    fetchInvoices,
  };
};
