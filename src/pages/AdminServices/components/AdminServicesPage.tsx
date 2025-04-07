
import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { serviceRequestsTable, ServiceRequest, supabase } from '@/integrations/supabase/client';
import AdminEmailSettings from './AdminEmailSettings';
import ServiceFilters from './ServiceFilters';
import ServiceRequestsTable from './ServiceRequestsTable';
import ServiceRequestDialog from './ServiceRequestDialog';
import ServicesManagement from './ServicesManagement';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

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
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('requests');

  // Fetch service requests from Supabase
  const fetchServiceRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching service requests...');
      
      // Use a more direct query to ensure we get all requests
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .order('request_date', { ascending: false });
        
      if (error) {
        console.error('Supabase error:', error);
        setError(`Error fetching data: ${error.message}`);
        throw error;
      }
      
      console.log('Service requests fetched:', data);
      
      if (data) {
        setServiceRequests(data);
      }
    } catch (error) {
      console.error('Error fetching service requests:', error);
      setError('Failed to load service requests');
      toast({
        title: "Error",
        description: "Failed to load service requests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);
  
  useEffect(() => {
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
  }, [fetchServiceRequests]);

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
      (request.service_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
      (request.client_name?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Manage Services</h1>
        <p className="text-muted-foreground">Oversee services offered and handle client requests</p>
      </div>
      
      <AdminEmailSettings 
        adminEmail={adminEmail}
        setAdminEmail={setAdminEmail}
        handleSaveEmail={handleSaveEmail}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2">
          <TabsTrigger value="requests">Client Requests</TabsTrigger>
          <TabsTrigger value="services">Service Catalog</TabsTrigger>
        </TabsList>
        
        <TabsContent value="requests" className="space-y-6">
          <ServiceFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
          
          {error && (
            <div className="p-4 mb-4 text-white bg-red-500 rounded-md">
              <p><strong>Error:</strong> {error}</p>
              <p>Check browser console for more details.</p>
            </div>
          )}
          
          <ServiceRequestsTable 
            loading={loading}
            filteredRequests={filteredRequests}
            openDetailsDialog={openDetailsDialog}
            handleUpdateStatus={handleUpdateStatus}
          />
        </TabsContent>
        
        <TabsContent value="services">
          <ServicesManagement />
        </TabsContent>
      </Tabs>
      
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
