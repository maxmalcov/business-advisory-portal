import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import AdminEmailSettings from './AdminEmailSettings';
import ServiceFilters from './ServiceFilters';
import ServiceRequestsTable from './ServiceRequestsTable';
import ServiceRequestDialog from './ServiceRequestDialog';
import ServiceDebugInfo from './ServiceDebugInfo';
import { useServiceRequests } from '../hooks/useServiceRequests';
import { useServiceRequestData } from '../hooks/useServiceRequestData';

const AdminServicesPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    loading,
    serviceRequests,
    filteredRequests,
    handleUpdateStatus,
  } = useServiceRequests();

  const {
    adminEmail,
    setAdminEmail,
    adminNotes,
    setAdminNotes,
    error,
    isDialogOpen,
    setIsDialogOpen,
    selectedRequest,
    handleSaveEmail,
    handleDelete,
  } = useServiceRequestData();

  const openDetailsDialog = (request: any) => {
    setSelectedRequest(request);
    setAdminNotes(request.admin_notes || '');
    setIsDialogOpen(true);
  };

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
      
      {error && (
        <div className="p-4 mb-4 text-white bg-red-500 rounded-md">
          <p><strong>Error:</strong> {error}</p>
          <p>Check browser console for more details.</p>
        </div>
      )}
      
      <ServiceDebugInfo 
        serviceRequests={serviceRequests}
        filteredRequests={filteredRequests}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
      />
      
      <ServiceRequestsTable 
        loading={loading}
        filteredRequests={filteredRequests}
        openDetailsDialog={openDetailsDialog}
        handleUpdateStatus={handleUpdateStatus}
        handleDelete={handleDelete}
      />
      
      <ServiceRequestDialog 
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        selectedRequest={selectedRequest}
        adminNotes={adminNotes}
        setAdminNotes={setAdminNotes}
        handleSaveNotes={async () => {
          if (!selectedRequest) return;
    
          // try {
          //   const { error } = await serviceRequestsTable()
          //     .update({ admin_notes: adminNotes })
          //     .eq('id', selectedRequest.id);
            
          //   if (error) {
          //     throw error;
          //   }
            
          //   // Update local state
          //   setServiceRequests(prev => 
          //     prev.map(request => 
          //       request.id === selectedRequest.id ? { ...request, admin_notes: adminNotes } : request
          //     )
          //   );
            
          //   setIsDialogOpen(false);
            
          //   toast({
          //     title: "Notes Saved",
          //     description: "Admin notes have been updated for this request.",
          //   });
          // } catch (error) {
          //   console.error('Error saving notes:', error);
          //   toast({
          //     title: "Save Failed",
          //     description: "Failed to save notes. Please try again.",
          //     variant: "destructive"
          //   });
          // }
        }}
      />
    </div>
  );
};

export default AdminServicesPage;
