import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Inbox } from 'lucide-react';
import ServiceRequestsList from './components/ServiceRequestsList';
import ServiceFilters from './components/ServiceFilters';
import RequestDetailsDialog from './components/RequestDetailsDialog';
import { useServiceRequests } from './hooks/useServiceRequests';
import { PageHeader } from '@/components/ui/page-header';
import { useLanguage } from '@/context/LanguageContext.tsx';

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
    handleSaveNotes,
  } = useServiceRequests();

  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Inbox className="h-6 w-6" />}
        title={t('service.requests.title')}
        subtitle={t('service.requests.description')}
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
          <CardTitle>{t('service.requests.title')}</CardTitle>
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
