
import React from 'react';
import { Badge } from '@/components/ui/badge';

type StatusBadgeProps = {
  status: string;
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch(status) {
    case 'active':
      return <Badge className="bg-green-500">Active</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-500">Pending</Badge>;
    case 'rejected':
      return <Badge className="bg-red-500">Rejected</Badge>;
    case 'inactive':
      return <Badge className="bg-gray-500">Inactive</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export default StatusBadge;
