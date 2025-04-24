
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ServiceRequestsList from './ServiceRequestsList';
import { ServiceRequest } from '@/integrations/supabase/client';

interface ServiceRequestsContainerProps {
  loading: boolean;
  filteredRequests: ServiceRequest[];
  openDetailsDialog: (request: ServiceRequest) => void;
  handleUpdateStatus: (requestId: string, newStatus: 'available' | 'pending' | 'completed' | 'rejected') => void;
}

const ServiceRequestsContainer: React.FC<ServiceRequestsContainerProps> = ({
  loading,
  filteredRequests,
  openDetailsDialog,
  handleUpdateStatus
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <ServiceRequestsList
          loading={loading}
          filteredRequests={filteredRequests}
          openDetailsDialog={openDetailsDialog}
          handleUpdateStatus={handleUpdateStatus}
        />
      </CardContent>
    </Card>
  );
};

export default ServiceRequestsContainer;
