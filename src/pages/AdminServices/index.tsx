
import React from 'react';
import AdminServicesHeader from './components/AdminServicesHeader';
import ServiceFilters from './components/ServiceFilters';
import ServiceRequestsContainer from './components/ServiceRequestsContainer';
import RequestDetailsDialog from './components/RequestDetailsDialog';
import ServicesManagement from './components/ServicesManagement';
import { useServiceRequests } from './hooks/useServiceRequests';
import { useServiceData } from './hooks/useServiceData';

const AdminServices: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    loading: requestsLoading,
    filteredRequests,
    selectedRequest,
    isDialogOpen,
    setIsDialogOpen,
    adminNotes,
    setAdminNotes,
    handleUpdateStatus,
    openDetailsDialog,
    handleSaveNotes
  } = useServiceRequests();

  const { DeleteConfirmationDialog } = useServiceData();

  return (
    <div className="space-y-6">
      <AdminServicesHeader />
      
      <ServiceFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      
      <ServiceRequestsContainer
        loading={requestsLoading}
        filteredRequests={filteredRequests}
        openDetailsDialog={openDetailsDialog}
        handleUpdateStatus={handleUpdateStatus}
      />
      
      <ServicesManagement />
      
      <RequestDetailsDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        selectedRequest={selectedRequest}
        adminNotes={adminNotes}
        setAdminNotes={setAdminNotes}
        handleSaveNotes={handleSaveNotes}
      />
      
      <DeleteConfirmationDialog />
    </div>
  );
};

export default AdminServices;
