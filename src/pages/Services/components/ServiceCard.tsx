
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
  const getStatusButton = (status: ServiceStatus) => {
    switch(status) {
      case 'pending':
        return (
          <div className="w-full h-10 flex items-center justify-center rounded-md bg-[#FFF7DB] text-[#9B7D00]">
            Pending
          </div>
        );
      case 'completed':
        return (
          <div className="w-full h-10 flex items-center justify-center rounded-md bg-[#E7F9ED] text-[#3B9252]">
            Completed
          </div>
        );
      case 'rejected':
        return (
          <div className="w-full h-10 flex items-center justify-center rounded-md bg-[#FFE8E8] text-[#D14343]">
            Rejected
          </div>
        );
      default:
        return (
          <Button 
            variant={popular ? "default" : "outline"}
            onClick={() => status === 'available' && onRequestService(id)}
            className="w-full"
          >
            Request Service
          </Button>
        );
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
          {popular && <Badge className="bg-primary">Popular</Badge>}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
          {badges && badges.length > 0 ? (
            badges.map((badge, index) => (
              <div key={index} className="flex items-center space-x-2">
                <FileCheck className="h-4 w-4 text-primary" />
                <span className="text-sm">{badge}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Service price: ${parseFloat(price).toFixed(2)}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 pt-2 border-t">
        <div className="w-full flex justify-between items-center">
          <div>
            <span className="font-semibold">${parseFloat(price).toFixed(2)}</span>
          </div>
        </div>
        {getStatusButton(status)}
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
