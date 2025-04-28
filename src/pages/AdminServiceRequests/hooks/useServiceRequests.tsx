
import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import {serviceRequestsTable} from "@/integrations/supabase/client.ts";
import {useLanguage} from "@/context/LanguageContext.tsx";

// Types
export type ServiceStatus = 'all' | 'pending' | 'completed' | 'rejected';

export interface ServiceRequest {
  id: string;
  client_id: string;
  client_name: string;
  service_id: string;
  service_name: string;
  request_date: string;
  updated_at: string;
  status: string;
  admin_notes?: string;
  details?: string;
}

export const useServiceRequests = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ServiceRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<ServiceStatus>('all');
  
  // For details dialog
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [adminNotes, setAdminNotes] = useState<string>('');

  // Mock data
  useEffect(() => {
    const timer = setTimeout(async () => {
      const mockRequests: ServiceRequest[] = (await serviceRequestsTable().select("*") as any).data as ServiceRequest[]

      setRequests(mockRequests);
      setFilteredRequests(mockRequests);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter requests based on search and status
  useEffect(() => {
    let filtered = [...requests];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (request) => 
          request.client_name.toLowerCase().includes(query) || 
          request.service_name.toLowerCase().includes(query)
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }
    
    setFilteredRequests(filtered);
  }, [requests, searchQuery, statusFilter]);

  // Open the details dialog
  const openDetailsDialog = useCallback((request: ServiceRequest) => {
    setSelectedRequest(request);
    setAdminNotes(request.admin_notes || '');
    setIsDialogOpen(true);
  }, []);

  const {t} = useLanguage()

  // Update request status
  const handleUpdateStatus = useCallback(async (requestId: string, newStatus: ServiceStatus) => {
    if (newStatus === 'all') return; // 'all' is not a valid status for a request
    
    setRequests(prevRequests => 
      prevRequests.map(request => 
        request.id === requestId 
          ? { ...request, status: newStatus, updated_at: new Date().toISOString() } 
          : request
      )
    );

    await serviceRequestsTable().update({ status: newStatus }).eq('id', requestId)
    
    toast({
      title: t('service.request.toast.title'),
      description: t('service.request.toast.description'),
    });
  }, []);

  // Save admin notes
  const handleSaveNotes = useCallback(async () => {
    if (!selectedRequest) return;
    
    setLoading(true);
    await serviceRequestsTable().update({ admin_notes: adminNotes }).eq('client_id', selectedRequest.client_id)

    setRequests(prevRequests =>
      prevRequests.map(request => 
        request.id === selectedRequest.id 
          ? { ...request, admin_notes: adminNotes, updated_at: new Date().toISOString() } 
          : request
      )
    );

    toast({
      title: t('service.notes.toast.title'),
      description: t('service.notes.toast.description'),
    });
    
    setLoading(false);
    setIsDialogOpen(false);
  }, [selectedRequest, adminNotes]);

  return {
    requests,
    filteredRequests,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    selectedRequest,
    isDialogOpen,
    setIsDialogOpen,
    adminNotes,
    setAdminNotes,
    openDetailsDialog,
    handleUpdateStatus,
    handleSaveNotes
  };
};
