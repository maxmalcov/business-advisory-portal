
import React from 'react';
import ServiceCatalogHeader from './components/ServiceCatalogHeader';
import ServicesManagement from './components/ServicesManagement';
import { useServiceData } from '@/pages/AdminServices/hooks/useServiceData';

const AdminServiceCatalog: React.FC = () => {
  const { DeleteConfirmationDialog } = useServiceData();

  return (
    <div className="space-y-6">
      <ServiceCatalogHeader />
      <ServicesManagement />
      <DeleteConfirmationDialog />
    </div>
  );
};

export default AdminServiceCatalog;
