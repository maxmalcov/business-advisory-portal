
import React from 'react';
import { Badge } from '@/components/ui/badge';

type StatusBadgeProps = {
  status: string;
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const baseClasses = "w-24 justify-center"; // Fixed width and center-aligned text

  switch(status) {
    case 'active':
      return <Badge className={`${baseClasses} bg-green-500`}>Active</Badge>;
    case 'pending':
      return <Badge className={`${baseClasses} bg-yellow-500`}>Pending</Badge>;
    case 'rejected':
      return <Badge className={`${baseClasses} bg-red-500`}>Rejected</Badge>;
    case 'inactive':
      return <Badge className={`${baseClasses} bg-gray-500`}>Inactive</Badge>;
    default:
      return <Badge className={baseClasses}>{status}</Badge>;
  }
};

export default StatusBadge;
