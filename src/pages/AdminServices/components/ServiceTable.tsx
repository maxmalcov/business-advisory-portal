
import React from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Service } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Edit, Trash } from 'lucide-react';

interface ServiceTableProps {
  services: Service[];
  onDelete: (serviceId: string) => void;
}

const ServiceTable: React.FC<ServiceTableProps> = ({ services, onDelete }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.map((service) => (
          <TableRow key={service.id}>
            <TableCell className="font-medium">{service.title}</TableCell>
            <TableCell className="max-w-md truncate">{service.description}</TableCell>
            <TableCell>${service.price}</TableCell>
            <TableCell>{service.category || '-'}</TableCell>
            <TableCell>
              {service.status === 'active' ? 
                <Badge className="bg-green-500">Active</Badge> : 
                <Badge variant="outline" className="text-red-500">Inactive</Badge>
              }
            </TableCell>
            <TableCell>{formatDate(service.created_at)}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  asChild
                >
                  <Link to={`/admin/services/edit/${service.id}`}>
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => onDelete(service.id)}
                >
                  <Trash className="h-4 w-4 mr-1" /> Delete
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
