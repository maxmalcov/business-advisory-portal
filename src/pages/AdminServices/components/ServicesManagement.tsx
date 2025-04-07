
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';
import ServiceTable from './ServiceTable';
import ServiceForm from './ServiceForm';
import { useServiceManagement } from '../hooks/useServiceManagement';

interface ServicesManagementProps {
  // Add any props here
}

const ServicesManagement: React.FC<ServicesManagementProps> = () => {
  const location = useLocation();
  const {
    // Service data
    services,
    loading,
    
    // Dialog state
    isDialogOpen,
    setIsDialogOpen,
    isEditMode,
    openAddDialog,
    openEditDialog,
    
    // Form state
    title,
    setTitle,
    description,
    setDescription,
    price,
    setPrice,
    iconName,
    setIconName,
    badges,
    setBadges,
    popular,
    setPopular,
    category,
    setCategory,
    status,
    setStatus,
    
    // Actions
    handleSubmit,
    handleDelete
  } = useServiceManagement();

  // Check URL for add action
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('action') === 'add') {
      openAddDialog();
      // Clean up the URL (optional)
      const newUrl = location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [location.search, openAddDialog]);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Services Management</CardTitle>
        <Button 
          onClick={openAddDialog} 
          disabled={loading}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Service
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
            onEdit={openEditDialog} 
            onDelete={handleDelete} 
          />
        )}
      </CardContent>

      {/* Service Form Dialog */}
      <ServiceForm
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        isEditMode={isEditMode}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        price={price}
        setPrice={setPrice}
        iconName={iconName}
        setIconName={setIconName}
        badges={badges}
        setBadges={setBadges}
        popular={popular}
        setPopular={setPopular}
        category={category}
        setCategory={setCategory}
        status={status}
        setStatus={setStatus}
        handleSubmit={handleSubmit}
      />
    </Card>
  );
};

export default ServicesManagement;
