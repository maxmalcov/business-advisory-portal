
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, Clock, XCircle } from 'lucide-react';

interface ServiceRequest {
  id: string;
  client: string;
  service: string;
  status: string;
  date: string;
  details?: string;
}

interface RequestDetailsDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  selectedRequest: ServiceRequest | null;
  adminNotes: string;
  setAdminNotes: (notes: string) => void;
  handleSaveNotes: () => void;
}

const RequestDetailsDialog: React.FC<RequestDetailsDialogProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  selectedRequest,
  adminNotes,
  setAdminNotes,
  handleSaveNotes
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

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Service Request Details</DialogTitle>
          <DialogDescription>
            View and manage the service request
          </DialogDescription>
        </DialogHeader>
        
        {selectedRequest && (
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-1">Client</p>
                <p className="text-sm">{selectedRequest.client}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Date</p>
                <p className="text-sm">{new Date(selectedRequest.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Service</p>
                <p className="text-sm">{selectedRequest.service}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Status</p>
                <div>{getStatusBadge(selectedRequest.status)}</div>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-1">Request Details</p>
              <p className="text-sm bg-secondary/50 p-3 rounded-md">
                {selectedRequest.details || "No details provided"}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-1">Admin Notes</p>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add notes about this request"
                rows={4}
              />
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Close
          </Button>
          <Button onClick={handleSaveNotes}>Save Notes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetailsDialog;
