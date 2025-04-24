
import React from 'react';

const AdminServicesHeader: React.FC = () => {
  return (
    <div className="flex flex-col space-y-2">
      <h1 className="text-2xl font-bold tracking-tight">Manage Service Requests</h1>
      <p className="text-muted-foreground">Oversee and update service requests from clients</p>
    </div>
  );
};

export default AdminServicesHeader;
