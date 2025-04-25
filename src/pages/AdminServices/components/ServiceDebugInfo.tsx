
import React from 'react';
import { ServiceRequest } from '@/integrations/supabase/client';

interface ServiceDebugInfoProps {
  serviceRequests: ServiceRequest[];
  filteredRequests: ServiceRequest[];
  searchQuery: string;
  statusFilter: string;
}

const ServiceDebugInfo: React.FC<ServiceDebugInfoProps> = ({
  serviceRequests,
  filteredRequests,
  searchQuery,
  statusFilter
}) => {
  return (
    <div className="p-4 mb-4 text-black bg-yellow-100 rounded-md">
      <h3 className="font-semibold mb-2">Debug Information</h3>
      <p>Total service requests: {serviceRequests.length}</p>
      <p>Filtered service requests: {filteredRequests.length}</p>
      <p>Current search query: {searchQuery || "(none)"}</p>
      <p>Current status filter: {statusFilter}</p>
      <details>
        <summary className="cursor-pointer text-blue-600">View raw service requests data</summary>
        <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto text-xs">
          {JSON.stringify(serviceRequests, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default ServiceDebugInfo;
