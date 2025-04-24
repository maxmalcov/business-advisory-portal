import React from 'react';
import ServicesHeader from './components/ServicesHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ServiceFilters from './components/ServiceFilters';
import ServiceRequestsList from './components/ServiceRequestsList';
import RequestDetailsDialog from './components/RequestDetailsDialog';
import { useServiceRequests } from './hooks/useServiceRequests';
import ServicesManagement from './components/ServicesManagement';
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
      <ServicesHeader />
      
      {/* Filters */}
      <ServiceFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      
      {/* Service Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Service Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <ServiceRequestsList
            loading={requestsLoading}
            filteredRequests={filteredRequests}
            openDetailsDialog={openDetailsDialog}
            handleUpdateStatus={handleUpdateStatus}
          />
        </CardContent>
      </Card>
      
      {/* Services Management */}
      <ServicesManagement />
      
      {/* Details Dialog */}
      <RequestDetailsDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        selectedRequest={selectedRequest}
        adminNotes={adminNotes}
        setAdminNotes={setAdminNotes}
        handleSaveNotes={handleSaveNotes}
      />
      
      {/* Service Delete Confirmation Dialog */}
      <DeleteConfirmationDialog />
    </div>
  );
};

export default AdminServices;
