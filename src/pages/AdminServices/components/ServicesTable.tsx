
import React from 'react';
import { format } from 'date-fns';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Card,
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Service } from '@/integrations/supabase/client';
import { Edit, Trash2, Check, X } from 'lucide-react';

interface ServicesTableProps {
  loading: boolean;
  filteredServices: Service[];
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  onToggleStatus: (service: Service) => void;
}

const ServicesTable: React.FC<ServicesTableProps> = ({
  loading,
  filteredServices,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500">Inactive</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return 'Invalid date';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <Card>
      <CardContent className="p-0">
        {loading ? (
          <div className="text-center py-4">Loading services...</div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-4">No services found.</div>
        ) : (
          <Table>
            <TableCaption>List of all services offered to clients</TableCaption>
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
              {filteredServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.title}</TableCell>
                  <TableCell className="max-w-xs truncate">{service.description}</TableCell>
                  <TableCell>{formatPrice(service.price)}</TableCell>
                  <TableCell>{service.category || '-'}</TableCell>
                  <TableCell>{getStatusBadge(service.status)}</TableCell>
                  <TableCell>{formatDate(service.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onEdit(service)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      {service.status === 'active' ? (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="bg-red-50 hover:bg-red-100 text-red-700"
                          onClick={() => onToggleStatus(service)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="bg-green-50 hover:bg-green-100 text-green-700"
                          onClick={() => onToggleStatus(service)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="bg-red-50 hover:bg-red-100 text-red-700"
                        onClick={() => onDelete(service)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default ServicesTable;
