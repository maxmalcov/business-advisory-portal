
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';
import ServiceTable from './ServiceTable';
import { useServiceData } from '../hooks/useServiceData';

const ServicesManagement: React.FC = () => {
  const { services, loading, handleDelete } = useServiceData();

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Services Management</CardTitle>
        <Button 
          asChild
          disabled={loading}
        >
          <Link to="/admin/services/create">
            <Plus className="h-4 w-4 mr-2" /> Add New Service
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No services found. Add your first service!</p>
          </div>
        ) : (
          <ServiceTable 
            services={services}
            onDelete={handleDelete}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ServicesManagement;
