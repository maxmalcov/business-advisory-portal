
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, Clock, XCircle } from 'lucide-react';

interface ServiceRequest {
  id: string;
  client: string;
  service: string;
  status: 'pending' | 'in progress' | 'completed' | 'rejected';
  date: string;
  details?: string;
}

interface ServiceRequestsListProps {
  loading: boolean;
  filteredRequests: ServiceRequest[];
  openDetailsDialog: (request: ServiceRequest) => void;
  handleUpdateStatus: (requestId: string, status: string) => void;
}

const ServiceRequestsList: React.FC<ServiceRequestsListProps> = ({
  loading,
  filteredRequests,
  openDetailsDialog,
  handleUpdateStatus
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case 'in progress':
        return <Badge variant="secondary" className="flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> In Progress</Badge>;
      case 'completed':
        return <Badge variant="default" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Completed</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" /> Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (filteredRequests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No service requests found</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredRequests.map((request) => (
          <TableRow key={request.id}>
            <TableCell className="font-medium">{request.client}</TableCell>
            <TableCell>{request.service}</TableCell>
            <TableCell>{getStatusBadge(request.status)}</TableCell>
            <TableCell>{new Date(request.date).toLocaleDateString()}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openDetailsDialog(request)}
                >
                  Details
                </Button>
                
                {request.status === 'pending' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleUpdateStatus(request.id, 'in progress')}
                  >
                    Start
                  </Button>
                )}
                
                {request.status === 'in progress' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-green-600 hover:text-green-700 border-green-200 hover:border-green-300 hover:bg-green-50"
                    onClick={() => handleUpdateStatus(request.id, 'completed')}
                  >
                    Complete
                  </Button>
                )}
                
                {(request.status === 'pending' || request.status === 'in progress') && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-destructive hover:text-destructive border-destructive/20 hover:border-destructive/30 hover:bg-destructive/10"
                    onClick={() => handleUpdateStatus(request.id, 'rejected')}
                  >
                    Reject
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
