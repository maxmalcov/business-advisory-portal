
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Inbox } from 'lucide-react';
import ServiceRequestsList from './components/ServiceRequestsList';
import ServiceFilters from './components/ServiceFilters';
import RequestDetailsDialog from './components/RequestDetailsDialog';
import { useServiceRequests } from './hooks/useServiceRequests';
import { PageHeader } from '@/components/ui/page-header';

const AdminServiceRequests: React.FC = () => {
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

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Inbox className="h-6 w-6" />}
        title="Service Requests"
        subtitle="Oversee client service requests"
      />
      
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
      
      {/* Details Dialog */}
      <RequestDetailsDialog
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

export default AdminServiceRequests;
