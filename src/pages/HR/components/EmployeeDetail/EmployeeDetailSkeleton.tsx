
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { User, Briefcase, Calendar, Clock } from 'lucide-react';

const EmployeeDetailSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Section Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      
      {/* Basic Information Card Skeleton */}
      <Card className="overflow-hidden border-0 shadow-md">
        <div className="bg-gray-50 px-6 py-3 border-b">
          <h3 className="text-md font-medium flex items-center">
            <User className="h-4 w-4 mr-2 text-blue-600" />
            Basic Information
          </h3>
        </div>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Company Name</p>
              <Skeleton className="h-5 w-24 mt-1" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <Skeleton className="h-5 w-16 mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Employment Dates Card Skeleton */}
      <Card className="overflow-hidden border-0 shadow-md">
        <div className="bg-gray-50 px-6 py-3 border-b">
          <h3 className="text-md font-medium flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-blue-600" />
            Employment Dates
          </h3>
        </div>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Start Date</p>
              <Skeleton className="h-5 w-32 mt-1" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">End Date</p>
              <Skeleton className="h-5 w-32 mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Identification Card Skeleton */}
      <Card className="overflow-hidden border-0 shadow-md">
        <div className="bg-gray-50 px-6 py-3 border-b">
          <h3 className="text-md font-medium flex items-center">
            <Briefcase className="h-4 w-4 mr-2 text-blue-600" />
            Identification
          </h3>
        </div>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">DNI/TIE</p>
              <Skeleton className="h-5 w-20 mt-1" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">ID Document</p>
              <div className="flex items-center">
                <Skeleton className="h-5 w-32 mt-1" />
                <Skeleton className="h-8 w-16 ml-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Schedule Card Skeleton */}
      <Card className="overflow-hidden border-0 shadow-md">
        <div className="bg-gray-50 px-6 py-3 border-b">
          <h3 className="text-md font-medium flex items-center">
            <Clock className="h-4 w-4 mr-2 text-blue-600" />
            Schedule
          </h3>
        </div>
        <CardContent className="pt-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Weekly Working Schedule</p>
            <Skeleton className="h-5 w-full mt-1" />
            <Skeleton className="h-5 w-3/4 mt-1" />
            <Skeleton className="h-5 w-1/2 mt-1" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDetailSkeleton;
