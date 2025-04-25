
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ServiceRequest } from '@/integrations/supabase/client';
import { formatDate } from '../utils/formatters';
import { Clock, Loader2, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface ServiceRequestsTableProps {
  loading: boolean;
  filteredRequests: ServiceRequest[];
  openDetailsDialog: (request: ServiceRequest) => void;
  handleUpdateStatus: (requestId: string, newStatus: 'available' | 'pending' | 'completed' | 'rejected') => void;
  handleDelete: (requestId: string) => void;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return <Badge variant="outline"><Clock className="mr-1 h-3 w-3" /> Pending</Badge>;
    case 'completed':
      return <Badge className="bg-green-500"><CheckCircle className="mr-1 h-3 w-3" /> Completed</Badge>;
    case 'rejected':
      return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" /> Rejected</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const ServiceRequestsTable: React.FC<ServiceRequestsTableProps> = ({
  loading,
  filteredRequests,
  openDetailsDialog,
  handleUpdateStatus,
  handleDelete
}) => {
  const [deleteRequestId, setDeleteRequestId] = React.useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (filteredRequests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No service requests found matching your criteria.</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRequests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium">{request.client_name}</TableCell>
              <TableCell>{request.service_name}</TableCell>
              <TableCell>
                <StatusBadge status={request.status} />
              </TableCell>
              <TableCell>{formatDate(request.request_date)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openDetailsDialog(request)}
                  >
                    Details
                  </Button>

                  {request.status !== 'pending' && (
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus(request.id, 'pending')}
                    >
                      Reset to Pending
                    </Button>
                  )}

                  {request.status === 'pending' && (
                    <>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="bg-green-50 hover:bg-green-100 text-green-700"
                        onClick={() => handleUpdateStatus(request.id, 'completed')}
                      >
                        Complete
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="bg-red-50 hover:bg-red-100 text-red-700"
                        onClick={() => handleUpdateStatus(request.id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:bg-red-500 hover:text-white border-red-200"
                    onClick={() => setDeleteRequestId(request.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={!!deleteRequestId} onOpenChange={() => setDeleteRequestId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this service request? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => {
                if (deleteRequestId) {
                  handleDelete(deleteRequestId);
                  setDeleteRequestId(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ServiceRequestsTable;
