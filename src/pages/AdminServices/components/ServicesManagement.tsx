
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ServiceTable from './ServiceTable';
import ServiceForm from './ServiceForm';
import { useServiceManagement } from '../hooks/useServiceManagement';

interface ServicesManagementProps {
  // Add any props here
}

const ServicesManagement: React.FC<ServicesManagementProps> = () => {
  const {
    services,
    loading,
    isDialogOpen,
    setIsDialogOpen,
    isEditMode,
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
    openAddDialog,
    openEditDialog,
    handleSubmit,
    handleDelete
  } = useServiceManagement();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Services Management</CardTitle>
        <Button onClick={openAddDialog}>Add New Service</Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading services...</div>
        ) : services.length === 0 ? (
          <div className="text-center py-4">No services found. Add your first service!</div>
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
        handleSubmit={handleSubmit}
      />
    </Card>
  );
};

export default ServicesManagement;
