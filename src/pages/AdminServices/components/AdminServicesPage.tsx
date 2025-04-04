
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { serviceRequestsTable, ServiceRequest } from '@/integrations/supabase/client';
import { supabase } from '@/integrations/supabase/client';
import AdminEmailSettings from './AdminEmailSettings';
import ServiceFilters from './ServiceFilters';
import ServiceRequestsTable from './ServiceRequestsTable';
import ServiceRequestDialog from './ServiceRequestDialog';

const AdminServicesPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [adminEmail, setAdminEmail] = useState('admin@example.com');
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  // Fetch service requests from Supabase
  useEffect(() => {
    const fetchServiceRequests = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await serviceRequestsTable()
          .select('*')
          .order('request_date', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setServiceRequests(data);
        }
      } catch (error) {
        console.error('Error fetching service requests:', error);
        toast({
          title: "Error",
          description: "Failed to load service requests",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchServiceRequests();
    
    // Set up a realtime subscription for updates to the service_requests table
    const subscription = supabase
      .channel('service_request_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'service_requests' 
      }, (payload) => {
        console.log('Change received!', payload);
        fetchServiceRequests();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [toast]);

  const handleUpdateStatus = async (requestId: string, newStatus: 'available' | 'pending' | 'completed' | 'rejected') => {
    try {
      const { error } = await serviceRequestsTable()
        .update({ status: newStatus })
        .eq('id', requestId);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setServiceRequests(prev => 
        prev.map(request => 
          request.id === requestId ? { ...request, status: newStatus } : request
        )
      );
      
      toast({
        title: "Status Updated",
        description: `Request status has been updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSaveEmail = async () => {
    toast({
      title: "Email Updated",
      description: "Admin notification email has been updated.",
    });
  };

  const openDetailsDialog = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setAdminNotes(request.admin_notes || '');
    setIsDialogOpen(true);
  };

  const handleSaveNotes = async () => {
    if (!selectedRequest) return;
    
    try {
      const { error } = await serviceRequestsTable()
        .update({ admin_notes: adminNotes })
        .eq('id', selectedRequest.id);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setServiceRequests(prev => 
        prev.map(request => 
          request.id === selectedRequest.id ? { ...request, admin_notes: adminNotes } : request
        )
      );
      
      setIsDialogOpen(false);
      
      toast({
        title: "Notes Saved",
        description: "Admin notes have been updated for this request.",
      });
    } catch (error) {
      console.error('Error saving notes:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save notes. Please try again.",
        variant: "destructive"
      });
    }
  };

  const filteredRequests = serviceRequests.filter(request => {
    const matchesSearch = 
      request.service_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      request.client_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Manage Service Requests</h1>
        <p className="text-muted-foreground">Oversee and update service requests from clients</p>
      </div>
      
      <AdminEmailSettings 
        adminEmail={adminEmail}
        setAdminEmail={setAdminEmail}
        handleSaveEmail={handleSaveEmail}
      />
      
      <ServiceFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      
      <ServiceRequestsTable 
        loading={loading}
        filteredRequests={filteredRequests}
        openDetailsDialog={openDetailsDialog}
        handleUpdateStatus={handleUpdateStatus}
      />
      
      <ServiceRequestDialog 
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        selectedRequest={selectedRequest}
        adminNotes={adminNotes}
        setAdminNotes={setAdminNotes}
        handleSaveNotes={handleSaveNotes}
      />
    </div>
  );
};

export default AdminServicesPage;
