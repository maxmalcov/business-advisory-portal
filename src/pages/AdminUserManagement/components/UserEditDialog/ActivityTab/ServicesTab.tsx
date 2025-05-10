import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, CheckCircle, Clock, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { UserService } from '../../../hooks/useUserActivity';

interface ServicesTabProps {
  services: UserService[];
}

const ServicesTab: React.FC<ServicesTabProps> = ({ services }) => {
  const formatDate = (date: Date): string => {
    return format(date, 'PPP'); // e.g., "April 10, 2024"
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2 text-primary" />
            Services Ordered
          </CardTitle>
          <CardDescription>
            Full list of services requested by the user
          </CardDescription>
        </CardHeader>
        <CardContent>
          {services.length > 0 ? (
            <div className="border rounded-md divide-y">
              {services.map((service) => (
                <div key={service.id} className="p-4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                    <div className="space-y-1">
                      <h4 className="font-medium">{service.name}</h4>
                      <div className="text-sm text-muted-foreground">
                        Requested on {formatDate(service.requestDate)}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {service.adminAssigned && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Admin: </span>
                          <span>{service.adminAssigned}</span>
                        </div>
                      )}
                      <Badge
                        variant="outline"
                        className={
                          service.status === 'completed'
                            ? 'bg-green-50 text-green-600 hover:bg-green-100'
                            : service.status === 'pending'
                              ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                              : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }
                      >
                        {service.status === 'completed' && (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        )}
                        {service.status === 'pending' && (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {service.status === 'rejected' && (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {service.status === 'completed'
                          ? 'Completed'
                          : service.status === 'pending'
                            ? 'Pending'
                            : 'Rejected'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <span className="text-muted-foreground">
                No services requested
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicesTab;
