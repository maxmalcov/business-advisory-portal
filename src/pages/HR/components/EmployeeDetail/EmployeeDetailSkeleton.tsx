
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const EmployeeDetailSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Basic Info Section */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500 flex items-center">
          <Skeleton className="h-4 w-4 mr-2" />
          <Skeleton className="h-5 w-[100px]" />
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <Skeleton className="h-4 w-[80px] mb-2" />
              <Skeleton className="h-5 w-[120px]" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Identification Section */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500 flex items-center">
          <Skeleton className="h-4 w-4 mr-2" />
          <Skeleton className="h-5 w-[100px]" />
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i}>
              <Skeleton className="h-4 w-[80px] mb-2" />
              <Skeleton className="h-5 w-[120px]" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Employment Dates Section */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500 flex items-center">
          <Skeleton className="h-4 w-4 mr-2" />
          <Skeleton className="h-5 w-[100px]" />
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i}>
              <Skeleton className="h-4 w-[80px] mb-2" />
              <Skeleton className="h-5 w-[120px]" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Schedule Section */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500 flex items-center">
          <Skeleton className="h-4 w-4 mr-2" />
          <Skeleton className="h-5 w-[100px]" />
        </h3>
        <div>
          <Skeleton className="h-4 w-[80px] mb-2" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailSkeleton;
