
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ServiceRequest, ServiceStatus } from '../hooks/useServiceRequests';
import { format } from 'date-fns';
import { Eye, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import {useLanguage} from "@/context/LanguageContext.tsx";

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
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (error) {
      return dateString;
    }
  };

  const {t} = useLanguage()

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <Badge className="bg-yellow-500">{t('status.pending')}</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">{t('status.completed')}</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">{t('status.rejected')}</Badge>;
      default:
        return <Badge>{t('status.unknown')}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">{t('service.request.loading')}</p>
        </div>
      </div>
    );
  }

  if (filteredRequests.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">{t('service.request.not-found')}</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('service.table.client')}</TableHead>
          <TableHead>{t('service.table.service')}</TableHead>
          <TableHead>{t('service.table.date')}</TableHead>
          <TableHead>{t('service.table.status')}</TableHead>
          <TableHead>{t('service.table.actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredRequests.map((request) => (
          <TableRow key={request.id}>
            <TableCell className="font-medium">{request.client_name}</TableCell>
            <TableCell>{request.service_name}</TableCell>
            <TableCell>{formatDate(request.request_date)}</TableCell>
            <TableCell>{getStatusBadge(request.status)}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDetailsDialog(request)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {t('service.table.details')}
                </Button>
                
                {request.status !== 'completed' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-green-50 hover:bg-green-100 text-green-600"
                    onClick={() => handleUpdateStatus(request.id, 'completed')}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {t('service.table.approve')}
                  </Button>
                )}
                
                {request.status !== 'rejected' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-red-50 hover:bg-red-100 text-red-600"
                    onClick={() => handleUpdateStatus(request.id, 'rejected')}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    {t('service.table.reject')}
                  </Button>
                )}
                
                {(request.status === 'completed' || request.status === 'rejected') && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-blue-50 hover:bg-blue-100 text-blue-600"
                    onClick={() => handleUpdateStatus(request.id, 'pending')}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    {t('service.table.reset')}
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
