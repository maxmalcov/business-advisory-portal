
import React from 'react';
import { format } from 'date-fns';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ServiceRequest } from '@/integrations/supabase/client';

type ServiceStatus = 'available' | 'pending' | 'completed' | 'rejected';

interface ServiceRequestDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  selectedRequest: ServiceRequest | null;
  adminNotes: string;
  setAdminNotes: (notes: string) => void;
  handleSaveNotes: () => void;
}

const ServiceRequestDialog: React.FC<ServiceRequestDialogProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  selectedRequest,
  adminNotes,
  setAdminNotes,
  handleSaveNotes
}) => {
  const getStatusBadge = (status: string) => {
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

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Service Request Details</DialogTitle>
          <DialogDescription>
            View and manage the details of this service request
          </DialogDescription>
        </DialogHeader>
        
        {selectedRequest && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Client:</Label>
                <div className="font-medium">{selectedRequest.client_name}</div>
              </div>
              <div>
                <Label>Service:</Label>
                <div className="font-medium">{selectedRequest.service_name}</div>
              </div>
              <div>
                <Label>Request Date:</Label>
                <div className="font-medium">{formatDate(selectedRequest.request_date)}</div>
              </div>
              <div>
                <Label>Status:</Label>
                <div className="font-medium">{getStatusBadge(selectedRequest.status)}</div>
              </div>
              <div>
                <Label>Last Updated:</Label>
                <div className="font-medium">{formatDate(selectedRequest.updated_at)}</div>
              </div>
              <div>
                <Label>Request ID:</Label>
                <div className="font-medium text-xs">{selectedRequest.id}</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="admin-notes">Admin Notes:</Label>
              <Textarea
                id="admin-notes"
                placeholder="Add internal notes about this request..."
                rows={4}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
              />
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveNotes}>Save Notes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceRequestDialog;
