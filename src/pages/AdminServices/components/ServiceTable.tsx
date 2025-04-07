
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Service } from '@/integrations/supabase/client';

interface ServiceTableProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (serviceId: string) => void;
}

const ServiceTable: React.FC<ServiceTableProps> = ({ services, onEdit, onDelete }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Popular</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.map((service) => (
          <TableRow key={service.id}>
            <TableCell className="font-medium">{service.title}</TableCell>
            <TableCell className="max-w-md truncate">{service.description}</TableCell>
            <TableCell>${service.price}</TableCell>
            <TableCell>
              {service.popular ? 
                <Badge className="bg-green-500">Popular</Badge> : 
                <Badge variant="outline">Regular</Badge>
              }
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEdit(service)}
                >
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => onDelete(service.id)}
                >
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ServiceTable;
