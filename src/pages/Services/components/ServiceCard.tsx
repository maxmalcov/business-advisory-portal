
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileCheck } from 'lucide-react';
import { ServiceCardProps, ServiceStatus } from '../types';

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  id,
  title, 
  description, 
  icon, 
  price, 
  badges = [],
  popular = false,
  status = 'available',
  onRequestService
}) => {
  const getStatusColor = (status: ServiceStatus) => {
    switch(status) {
      case 'pending': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return '';
    }
  };

  const getStatusText = (status: ServiceStatus) => {
    switch(status) {
      case 'pending': return 'Pending';
      case 'completed': return 'Completed';
      case 'rejected': return 'Rejected';
      default: return 'Request Service';
    }
  };

  return (
    <Card className={`h-full flex flex-col ${popular ? 'border-primary shadow-md' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-muted rounded-lg">
              {icon}
            </div>
            <CardTitle>{title}</CardTitle>
          </div>
          <div className="flex gap-2">
            {popular && <Badge className="bg-primary">Popular</Badge>}
            {status !== 'available' && (
              <Badge className={getStatusColor(status)}>
                {getStatusText(status)}
              </Badge>
            )}
          </div>
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
        <div className="w-full flex justify-end items-center">
          <Button 
            variant={popular ? "default" : "outline"}
            disabled={status !== 'available'} 
            onClick={() => status === 'available' && onRequestService(id)}
          >
            {getStatusText(status)}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
