
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type StatusBadgeProps = {
  status: string;
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const baseClasses = "w-24 justify-center"; // Fixed width and center-aligned text

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'active':
        return {
          class: 'bg-green-500',
          label: 'Active',
          tooltip: 'Subscription is active and accessible'
        };
      case 'pending':
        return {
          class: 'bg-yellow-500',
          label: 'Pending',
          tooltip: 'Waiting for admin approval'
        };
      case 'rejected':
        return {
          class: 'bg-red-500',
          label: 'Rejected',
          tooltip: 'Subscription request was rejected'
        };
      case 'inactive':
        return {
          class: 'bg-gray-500',
          label: 'Inactive',
          tooltip: 'Subscription has been stopped by admin'
        };
      default:
        return {
          class: '',
          label: status,
          tooltip: 'Unknown status'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className={cn(baseClasses, config.class)}>
            {config.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          {config.tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default StatusBadge;
