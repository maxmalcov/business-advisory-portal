
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { Loader2, ArrowRight } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ServiceRequest {
  id: string;
  service_id: string;
  service_name: string;
  price: string;
  description?: string;
  status: 'completed' | 'pending' | 'rejected';
  request_date: string;
}

interface ServiceJournalTableProps {
  requests: ServiceRequest[];
  isLoading: boolean;
  onRequestService: (serviceId: string) => void;
}

export const ServiceJournalTable: React.FC<ServiceJournalTableProps> = ({
  requests,
  isLoading,
  onRequestService,
}) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!requests.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <CardTitle className="text-lg font-medium mb-2">No Service Requests Yet</CardTitle>
          <CardDescription>Start by requesting a service from our service catalog.</CardDescription>
          <Button className="mt-4" asChild>
            <a href="/services">
              View Services
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Requests</CardTitle>
        <CardDescription>A history of all your service requests</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Request Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.service_name}</TableCell>
                <TableCell>{request.description}</TableCell>
                <TableCell>€{parseFloat(request.price).toFixed(2)}</TableCell>
                <TableCell>
                  {new Date(request.request_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(request.status)}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {request.status === 'rejected' && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={() => onRequestService(request.service_id)}
                          >
                            Request Again
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click to request this service again</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
