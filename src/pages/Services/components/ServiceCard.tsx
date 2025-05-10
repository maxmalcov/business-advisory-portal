import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileCheck } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ServiceCardProps, ServiceStatus } from '../types';
import { useLanguage } from '@/context/LanguageContext';

const ServiceCard: React.FC<ServiceCardProps> = ({
  id,
  title,
  description,
  icon,
  price,
  badges = [],
  status = 'available',
  onRequestService,
}) => {
  const { t } = useLanguage();
  const [isHovering, setIsHovering] = useState(false);

  const getButtonProps = (status: ServiceStatus) => {
    switch (status) {
      case 'completed':
        return {
          variant: 'outline' as const,
          className: `${isHovering ? 'bg-green-100 hover:bg-green-200' : 'bg-green-50'} text-green-600`,
          disabled: false,
          label: isHovering ? t('services.request') : t('status.completed'),
          tooltip: 'Request this service again',
        };
      case 'pending':
        return {
          variant: 'outline' as const,
          className:
            'bg-yellow-50 hover:bg-yellow-50 text-yellow-600 cursor-not-allowed',
          disabled: true,
          label: t('status.pending'),
          tooltip: 'Your request is being processed',
        };
      case 'rejected':
        return {
          variant: 'outline' as const,
          className: `${isHovering ? 'bg-red-100 hover:bg-red-200' : 'bg-red-50'} text-red-600`,
          disabled: false,
          label: isHovering ? t('services.request') : t('status.rejected'),
          tooltip: 'Request this service again',
        };
      default:
        return {
          variant: 'default' as const,
          className: '',
          disabled: false,
          label: t('services.request'),
          tooltip: '',
        };
    }
  };

  const buttonProps = getButtonProps(status);

  const ActionButton = () => {
    const button = (
      <Button
        variant={buttonProps.variant}
        className={buttonProps.className}
        disabled={buttonProps.disabled}
        onClick={() => !buttonProps.disabled && onRequestService(id)}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {buttonProps.label}
      </Button>
    );

    if (buttonProps.tooltip) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent>
              <p>{buttonProps.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return button;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-muted rounded-lg">{icon}</div>
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
          {badges.map((badge, index) => (
            <div key={index} className="flex items-center space-x-2">
              <FileCheck className="h-4 w-4 text-primary" />
              <span className="text-sm">{badge}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 pt-2 border-t">
        <div className="w-full flex justify-between items-center">
          <div>
            <span className="font-semibold">
              ${parseFloat(price).toFixed(2)}
            </span>
          </div>
          <ActionButton />
        </div>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
