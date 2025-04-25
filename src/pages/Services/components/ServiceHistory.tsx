
import React from 'react';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const ServiceHistory = () => {
  const { user } = useAuth();
  const { serviceRequests, loading } = useServiceRequests();

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="bg-muted/10">
              <div className="h-6 w-1/3 bg-muted rounded"></div>
            </CardHeader>
            <CardContent className="mt-4">
              <div className="h-4 w-2/3 bg-muted rounded"></div>
              <div className="h-4 w-1/4 bg-muted rounded mt-2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!serviceRequests?.length) {
    return (
      <Card className="bg-muted/5">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            No service requests found in your history.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {serviceRequests.map((request) => (
        <Card key={request.id}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span>{request.service_name}</span>
              <Badge
                variant={
                  request.status === 'approved'
                    ? 'success'
                    : request.status === 'rejected'
                    ? 'destructive'
                    : 'default'
                }
              >
                {request.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Requested on {format(new Date(request.request_date), 'PPP')}
            </p>
            {request.admin_notes && (
              <p className="mt-2 text-sm border-l-2 border-primary/20 pl-2">
                {request.admin_notes}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
