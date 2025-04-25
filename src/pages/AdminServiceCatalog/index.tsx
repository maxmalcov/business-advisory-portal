
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Wrench, Plus } from 'lucide-react';
import { useServiceData } from './hooks/useServiceData';
import ServiceTable from './components/ServiceTable';
import { PageHeader } from '@/components/ui/page-header';

const AdminServiceCatalog: React.FC = () => {
  const { services, loading, handleDelete, DeleteConfirmationDialog } = useServiceData();

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Wrench className="h-6 w-6" />}
        title="Service Catalog"
        subtitle="Manage available service offerings"
      />
      
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Available Services</CardTitle>
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
      
      {/* Service Delete Confirmation Dialog */}
      <DeleteConfirmationDialog />
    </div>
  );
};

export default AdminServiceCatalog;
