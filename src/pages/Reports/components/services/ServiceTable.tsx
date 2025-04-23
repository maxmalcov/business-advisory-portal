
import React from 'react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ServiceRequest } from '../../hooks/types/serviceTypes';

interface ServiceTableProps {
  services: ServiceRequest[];
  loading: boolean;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">Completed</Badge>;
    case 'in_progress':
      return <Badge className="bg-[#9b87f5]/20 text-[#7E69AB] hover:bg-[#9b87f5]/30 border-[#9b87f5]/30">In Progress</Badge>;
    case 'cancelled':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200">Cancelled</Badge>;
    default:
      return <Badge variant="outline">Requested</Badge>;
  }
};

const ServiceTable: React.FC<ServiceTableProps> = ({ services, loading }) => {
  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Requested</TableHead>
              <TableHead>Completion Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                    <div className="h-3 bg-muted rounded w-32 animate-pulse"></div>
                  </div>
                </TableCell>
                <TableCell><div className="h-4 bg-muted rounded w-32 animate-pulse"></div></TableCell>
                <TableCell><div className="h-6 bg-muted rounded w-20 animate-pulse"></div></TableCell>
                <TableCell><div className="h-4 bg-muted rounded w-24 animate-pulse"></div></TableCell>
                <TableCell><div className="h-4 bg-muted rounded w-24 animate-pulse"></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="py-10 text-center border rounded-md">
        <p className="text-muted-foreground">No service requests found matching your filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date Requested</TableHead>
            <TableHead>Completion Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{service.userName}</div>
                  <div className="text-sm text-muted-foreground">{service.userEmail}</div>
                </div>
              </TableCell>
              <TableCell className="font-medium">{service.serviceName}</TableCell>
              <TableCell>
                <StatusBadge status={service.status} />
              </TableCell>
              <TableCell>{format(new Date(service.requestDate), 'dd MMM yyyy')}</TableCell>
              <TableCell>
                {service.completionDate 
                  ? format(new Date(service.completionDate), 'dd MMM yyyy')
                  : '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ServiceTable;
