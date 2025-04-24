
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NotificationSettings from './components/NotificationSettings';
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
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Manage Service Requests</h1>
        <p className="text-muted-foreground">Oversee and update service requests from clients</p>
      </div>
      
      {/* Admin Email Setting */}
      <NotificationSettings />
      
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
