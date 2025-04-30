
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Square, Check, X } from 'lucide-react';  // Added Check and X icons
import StatusBadge from './StatusBadge';
import SubscriptionTypeIcon from './SubscriptionTypeIcon';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { Subscription } from '../types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {useLanguage} from "@/context/LanguageContext.tsx";

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  loading: boolean;
  onStatusChange: (subscriptionId: string, newStatus: Subscription['status'], iframeUrl?: string) => Promise<void>;
  onEdit: (subscription: Subscription) => void;
}

const SubscriptionTable: React.FC<SubscriptionTableProps> = ({ 
  subscriptions,
  loading,
  onStatusChange,
  onEdit
}) => {
  const isMobile = useIsMobile();

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  const renderActionButton = (
    icon: React.ReactNode,
    label: string,
    onClick: () => void,
    tooltipText: string
  ) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onClick}
          >
            {icon}
            <span>{label}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {tooltipText}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const {t} = useLanguage()

  const renderActions = (subscription: Subscription) => {
    const actions = [];

    // Active subscription actions - only Stop and Edit
    if (subscription.status === 'active') {
      actions.push(
        renderActionButton(
          <Square className="h-4 w-4 mr-1" />,
          t('subscription.admin.buttons.stop'),
          () => onStatusChange(subscription.id, 'inactive'),
          t('subscription.admin.buttons.stop.prompt')
        ),
        renderActionButton(
          <Edit className="h-4 w-4 mr-1" />,
          t('subscription.admin.buttons.edit'),
          () => onEdit(subscription),
          t('subscription.admin.buttons.edit.prompt')
        )
      );
    }

    // Pending subscription actions
    if (subscription.status === 'pending') {
      actions.push(
        renderActionButton(
          <Check className="h-4 w-4 mr-1" />,
          t('subscription.admin.buttons.approve'),
          () => onStatusChange(subscription.id, 'active', subscription.url),
          t('subscription.admin.buttons.approve.prompt')
        ),
        renderActionButton(
          <X className="h-4 w-4 mr-1" />,
          t('subscription.admin.buttons.reject'),
          () => onStatusChange(subscription.id, 'rejected'),
          t('subscription.admin.buttons.reject.prompt')
        )
      );
    }

    // Rejected or Inactive subscription actions
    if (subscription.status === 'rejected' || subscription.status === 'inactive') {
      actions.push(
        renderActionButton(
          <Check className="h-4 w-4 mr-1" />,
            t('subscription.admin.buttons.approve'),
          () => onStatusChange(subscription.id, 'active', subscription.url),
            t('subscription.admin.buttons.approve.prompt')
        )
      );
    }

    return (
      <div className="flex justify-end gap-2">
        {actions}
      </div>
    );
  };

  if (isMobile) {
    return (
      <div className="space-y-4">
        {subscriptions.map((subscription) => (
          <Card key={subscription.id} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <SubscriptionTypeIcon type={subscription.type} />
                <span className="font-medium">{subscription.name}</span>
              </div>
              <StatusBadge status={subscription.status} />
            </div>
            <div className="mt-4">
              {renderActions(subscription)}
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow style={{width: '100%'}}>
            <TableHead>{t('subscription.admin.table.name')}</TableHead>
            <TableHead>{t('subscription.admin.table.type')}</TableHead>
            <TableHead>{t('subscription.admin.table.user')}</TableHead>
            <TableHead>{t('subscription.admin.table.status')}</TableHead>
            <TableHead></TableHead>
            <TableHead style={{marginLeft: '100%'}} className="text-right">{t('subscription.admin.table.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((subscription) => (
            <TableRow key={subscription.id}>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <SubscriptionTypeIcon type={subscription.type} />
                  <span>{subscription.name}</span>
                </div>
              </TableCell>
              <TableCell>{subscription.type}</TableCell>
              <TableCell>{subscription.userName}</TableCell>
              <TableCell>
                <StatusBadge status={subscription.status} />
              </TableCell>
              <TableCell className="max-w-xs truncate">{subscription.url}</TableCell>
              <TableCell>
                {renderActions(subscription)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SubscriptionTable;
