
import React, { useState } from 'react';
import ServicesHeader from './components/ServicesHeader';
import ServiceFilters from './components/ServiceFilters';
import ServiceRequestsList from './components/ServiceRequestsList';
import RequestDetailsDialog from './components/RequestDetailsDialog';
import { useServiceRequests } from './hooks/useServiceRequests';
import ServicesManagement from './components/ServicesManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useServiceData } from './hooks/useServiceData';

const AdminServices: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("requests");
  
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
      
      <Tabs
        defaultValue="requests"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="requests">
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
        </TabsContent>
        
        <TabsContent value="management">
          {/* Services Management */}
          <ServicesManagement />
        </TabsContent>
      </Tabs>
      
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
