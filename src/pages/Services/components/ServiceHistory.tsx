
import React from 'react';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

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
            You haven't requested any services yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {serviceRequests.map((request) => (
        <Card key={request.id} className="overflow-hidden">
          <CardHeader className="py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{request.service_name}</CardTitle>
              <Badge
                variant={
                  request.status === 'approved'
                    ? 'default'
                    : request.status === 'rejected'
                    ? 'destructive'
                    : 'secondary'
                }
              >
                {request.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-sm text-muted-foreground">
              Requested on {format(new Date(request.request_date), 'PPP')}
            </div>
            {request.admin_notes && (
              <p className="mt-2 text-sm border-l-2 border-primary/20 pl-2">
                {request.admin_notes}
              </p>
            )}
            {request.status === 'rejected' && (
              <div className="mt-4">
                <Button variant="outline" size="sm" className="gap-2">
                  Request Again
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
