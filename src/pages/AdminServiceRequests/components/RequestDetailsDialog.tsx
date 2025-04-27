
import React from 'react';
import { ServiceRequest } from '../hooks/useServiceRequests';
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
import {useLanguage} from "@/context/LanguageContext.tsx";

type ServiceStatus = 'available' | 'pending' | 'completed' | 'rejected';

interface RequestDetailsDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  selectedRequest: ServiceRequest | null;
  adminNotes: string;
  setAdminNotes: (notes: string) => void;
  handleSaveNotes: () => Promise<void>;
}

const RequestDetailsDialog: React.FC<RequestDetailsDialogProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  selectedRequest,
  adminNotes,
  setAdminNotes,
  handleSaveNotes
}) => {
  const {t} = useLanguage()

  const getStatusBadge = (status: ServiceStatus) => {
    switch(status) {
      case 'pending':
        return <Badge className="bg-yellow-500">{t('status.pending')}</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">{t('status.completed')}</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">{t('status.rejected')}</Badge>;
      default:
        return <Badge>{t('status.available')}</Badge>;
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

  if (!selectedRequest) return null;

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('service.detail.title')}</DialogTitle>
          <DialogDescription>
            {t('service.detail.description')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t('service.detail.client')}</Label>
              <div className="font-medium">{selectedRequest.client_name}</div>
            </div>
            <div>
              <Label>{t('service.detail.service')}</Label>
              <div className="font-medium">{selectedRequest.service_name}</div>
            </div>
            <div>
              <Label>{t('service.detail.date')}</Label>
              <div className="font-medium">{formatDate(selectedRequest.request_date)}</div>
            </div>
            <div>
              <Label>{t('service.detail.status')}</Label>
              <div className="font-medium">{getStatusBadge(selectedRequest.status as ServiceStatus)}</div>
            </div>
            <div>
              <Label>{t('service.detail.last-update')}</Label>
              <div className="font-medium">{formatDate(selectedRequest.updated_at)}</div>
            </div>
            <div>
              <Label>{t('service.detail.req-id')}</Label>
              <div className="font-medium text-xs">{selectedRequest.id}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="admin-notes">{t('service.detail.admin-notes')}</Label>
            <Textarea
              id="admin-notes"
              placeholder={t('service.detail.add-note.placeholder')}
              rows={4}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>{t('service.detail.cancel')}</Button>
          <Button onClick={handleSaveNotes}>{t('service.detail.save-notes')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetailsDialog;
