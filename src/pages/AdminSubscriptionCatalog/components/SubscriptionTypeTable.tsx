
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Edit, Trash } from 'lucide-react';
import { SubscriptionType } from '../hooks/useSubscriptionTypes';
import SubscriptionTypeIcon from '../../AdminSubscriptions/components/SubscriptionTypeIcon';

interface SubscriptionTypeTableProps {
  subscriptionTypes: SubscriptionType[];
  onDelete: (typeId: string) => void;
}

const SubscriptionTypeTable: React.FC<SubscriptionTypeTableProps> = ({ subscriptionTypes, onDelete }) => {
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
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Type ID (Slug)</TableHead>
          <TableHead>Icon Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subscriptionTypes.map((type) => (
          <TableRow key={type.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <SubscriptionTypeIcon type={type.icon_type} />
                {type.name}
              </div>
            </TableCell>
            <TableCell className="max-w-md truncate">{type.description}</TableCell>
            <TableCell><code>{type.type_id}</code></TableCell>
            <TableCell>{type.icon_type}</TableCell>
            <TableCell>
              {type.status === 'active' ? 
                <Badge className="bg-green-500">Active</Badge> : 
                <Badge variant="outline" className="text-red-500">Inactive</Badge>
              }
            </TableCell>
            <TableCell>{formatDate(type.created_at)}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                >
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-500 hover:text-red-700 p-2"
                  onClick={() => onDelete(type.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SubscriptionTypeTable;
