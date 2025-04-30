
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {useLanguage} from "@/context/LanguageContext.tsx";

type StatusBadgeProps = {
  status: string;
  onClick?: () => void;
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, onClick }) => {
  const baseClasses = cn(
    "w-24 justify-center cursor-default",
    onClick && "cursor-pointer hover:opacity-90"
  );

  const {t} = useLanguage()

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'active':
        return {
          class: 'bg-green-500',
          label: t('active'),
          tooltip: 'Subscription is active and accessible'
        };
      case 'pending':
        return {
          class: 'bg-yellow-500',
          label: t('pending'),
          tooltip: 'Waiting for admin approval'
        };
      case 'rejected':
        return {
          class: 'bg-red-500',
          label: t('rejected'),
          tooltip: onClick ? 'Click to request again' : 'Subscription request was rejected'
        };
      case 'inactive':
        return {
          class: 'bg-gray-500',
          label: t('inactive'),
          tooltip: onClick ? 'Click to request again' : 'Subscription has been stopped by admin'
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

  const badge = (
    <Badge 
      className={cn(baseClasses, config.class)}
      onClick={onClick}
    >
      {config.label}
    </Badge>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent>
          {config.tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default StatusBadge;
