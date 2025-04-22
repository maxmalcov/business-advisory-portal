
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DateRange, DateFilterOption } from '@/pages/AdminUserManagement/hooks/types';
import { useDateFilter } from '@/pages/AdminUserManagement/hooks/useDateFilter';
import { format } from 'date-fns';

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

export const useInvoiceData = () => {
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userFilter, setUserFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'sales' | 'supplier'>('all');
  const [users, setUsers] = useState<{ id: string; name: string; email: string }[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  
  const {
    filterOption,
    setFilterOption,
    customDateRange,
    setCustomDateRange,
    currentDateRange,
    isWithinDateRange
  } = useDateFilter('30days');

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      // Fetch invoice uploads from both tables
      const [salesResponse, supplierResponse] = await Promise.all([
        supabase
          .from('invoice_uploads')
          .select(`
            id,
            file_name,
            file_size,
            created_at,
            storage_path,
            invoice_type,
            user_id
          `)
          .eq('invoice_type', 'sales'),
        supabase
          .from('invoice_uploads')
          .select(`
            id,
            file_name,
            file_size,
            created_at,
            storage_path,
            invoice_type,
            user_id
          `)
          .eq('invoice_type', 'supplier')
      ]);

      // Fetch all users to map their information to invoices
      const { data: userData } = await supabase
        .from('profiles')
        .select('id, name, email');
        
      const userMap = new Map();
      if (userData) {
        userData.forEach(user => {
          userMap.set(user.id, {
            name: user.name || 'Unknown',
            email: user.email || 'Unknown'
          });
        });
        setUsers(userData);
      }

      // Process and format the data
      const allInvoices: InvoiceItem[] = [];
      
      if (salesResponse.data) {
        const salesInvoices = salesResponse.data.map(invoice => {
          const userInfo = userMap.get(invoice.user_id) || { name: 'Unknown', email: 'Unknown' };
          return {
            id: invoice.id,
            fileName: invoice.file_name,
            type: 'sales' as const,
            date: new Date(invoice.created_at),
            size: invoice.file_size,
            path: invoice.storage_path,
            userName: userInfo.name,
            userEmail: userInfo.email,
            userId: invoice.user_id
          };
        });
        allInvoices.push(...salesInvoices);
      }
      
      if (supplierResponse.data) {
        const supplierInvoices = supplierResponse.data.map(invoice => {
          const userInfo = userMap.get(invoice.user_id) || { name: 'Unknown', email: 'Unknown' };
          return {
            id: invoice.id,
            fileName: invoice.file_name,
            type: 'supplier' as const,
            date: new Date(invoice.created_at),
            size: invoice.file_size,
            path: invoice.storage_path,
            userName: userInfo.name,
            userEmail: userInfo.email,
            userId: invoice.user_id
          };
        });
        allInvoices.push(...supplierInvoices);
      }
      
      // Sort by upload date (newest first)
      allInvoices.sort((a, b) => b.date.getTime() - a.date.getTime());
      
      setInvoices(allInvoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Apply filters to the invoice data
  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => {
      // Apply date filter
      const dateInRange = isWithinDateRange(invoice.date);
      
      // Apply user filter (match by name or email)
      const userMatch = !userFilter || 
        invoice.userId === userFilter || 
        invoice.userName.toLowerCase().includes(userFilter.toLowerCase()) || 
        invoice.userEmail.toLowerCase().includes(userFilter.toLowerCase());
      
      // Apply type filter
      const typeMatch = typeFilter === 'all' || invoice.type === typeFilter;
      
      return dateInRange && userMatch && typeMatch;
    });
  }, [invoices, isWithinDateRange, userFilter, typeFilter]);
  
  // Calculate pagination
  useEffect(() => {
    setTotalPages(Math.ceil(filteredInvoices.length / itemsPerPage));
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [filteredInvoices.length]);
  
  const paginatedInvoices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredInvoices.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredInvoices, currentPage]);
  
  // Create formatted CSV data
  const exportToCSV = () => {
    // CSV headers
    const headers = ['User', 'Email', 'File Name', 'Type', 'Upload Date', 'File Size'];
    const rows = [headers];
    
    // Add data
    filteredInvoices.forEach(invoice => {
      rows.push([
        invoice.userName,
        invoice.userEmail,
        invoice.fileName,
        invoice.type,
        format(invoice.date, 'yyyy-MM-dd HH:mm:ss'),
        `${Math.round(invoice.size / 1024)} KB`
      ]);
    });
    
    // Convert to CSV
    const csvContent = rows.map(row => row.join(',')).join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const date = format(new Date(), 'yyyy-MM-dd');
    
    link.href = URL.createObjectURL(blob);
    link.download = `invoices-report-${date}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    invoices: paginatedInvoices,
    allInvoices: filteredInvoices,
    loading,
    filterOption,
    setFilterOption,
    customDateRange,
    setCustomDateRange,
    currentDateRange,
    userFilter,
    setUserFilter,
    typeFilter,
    setTypeFilter,
    users,
    exportToCSV,
    currentPage,
    totalPages,
    setCurrentPage
  };
};
