
import React from 'react';
import ServicesManagement from './components/ServicesManagement';

const AdminServicesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Services Management</h1>
        <p className="text-muted-foreground">Create and manage service offerings for clients</p>
      </div>
      
      <ServicesManagement />
    </div>
  );
};

export default AdminServicesPage;
