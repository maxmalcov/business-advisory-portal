
import React from 'react';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ServiceRequest } from '@/integrations/supabase/client';
import { format } from 'date-fns';

type ServiceStatus = 'available' | 'pending' | 'completed' | 'rejected';

interface ServiceRequestsListProps {
  loading: boolean;
  filteredRequests: ServiceRequest[];
  openDetailsDialog: (request: ServiceRequest) => void;
  handleUpdateStatus: (requestId: string, newStatus: ServiceStatus) => void;
}

const ServiceRequestsList: React.FC<ServiceRequestsListProps> = ({
  loading,
  filteredRequests,
  openDetailsDialog,
  handleUpdateStatus
}) => {
  const getStatusBadge = (status: ServiceStatus) => {
    switch(status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge>Available</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading service requests...</div>;
  }

  if (filteredRequests.length === 0) {
    return <div className="text-center py-4">No service requests found.</div>;
  }

  return (
    <Table>
      <TableCaption>List of all service requests from clients</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Request Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredRequests.map((request) => (
          <TableRow key={request.id}>
            <TableCell>{request.client_name}</TableCell>
            <TableCell>{request.service_name}</TableCell>
            <TableCell>{formatDate(request.request_date)}</TableCell>
            <TableCell>{getStatusBadge(request.status as ServiceStatus)}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => openDetailsDialog(request)}
                >
                  Details
                </Button>
                
                {request.status === 'pending' && (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="bg-green-50 hover:bg-green-100 text-green-700"
                      onClick={() => handleUpdateStatus(request.id, 'completed')}
                    >
                      Complete
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="bg-red-50 hover:bg-red-100 text-red-700"
                      onClick={() => handleUpdateStatus(request.id, 'rejected')}
                    >
                      Reject
                    </Button>
                  </>
                )}
                {request.status !== 'pending' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleUpdateStatus(request.id, 'pending')}
                  >
                    Reset to Pending
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ServiceRequestsList;
