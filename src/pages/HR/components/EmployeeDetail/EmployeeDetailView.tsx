
import React from 'react';
import { Employee } from '../../types/employee';
import { User, Briefcase, Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

interface EmployeeDetailViewProps {
  employee: Employee;
}

const EmployeeDetailView: React.FC<EmployeeDetailViewProps> = ({ employee }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Safe date formatter function
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return '-';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header Section with Avatar and Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-gray-100">
            <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
              {getInitials(employee.fullName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold">{employee.fullName}</h2>
            <p className="text-gray-500">{employee.position}</p>
          </div>
        </div>
        <Badge className={employee.status === 'active' ? 'bg-green-500' : 'bg-red-500'}>
          {employee.status === 'active' ? 'Active' : 'Terminated'}
        </Badge>
      </div>
      
      {/* Basic Information Card */}
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
              <p className="text-sm font-semibold">{employee.companyName || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className="text-sm font-semibold">{employee.status === 'active' ? 'Active' : 'Terminated'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Employment Dates Card */}
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
              <p className="text-sm font-semibold">{formatDate(employee.startDate)}</p>
            </div>
            {(employee.status === 'terminated' || employee.endDate) && (
              <div>
                <p className="text-sm font-medium text-gray-500">End Date</p>
                <p className="text-sm font-semibold">{formatDate(employee.endDate)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Identification Card */}
      <Card className="overflow-hidden border-0 shadow-md">
        <div className="bg-gray-50 px-6 py-3 border-b">
          <h3 className="text-md font-medium flex items-center">
            <Briefcase className="h-4 w-4 mr-2 text-blue-600" />
            Identification
          </h3>
        </div>
        <CardContent className="pt-4">
          {employee.dniTie || employee.idDocument ? (
            <div className="grid grid-cols-2 gap-4">
              {employee.dniTie && (
                <div>
                  <p className="text-sm font-medium text-gray-500">DNI/TIE</p>
                  <p className="text-sm font-semibold">{employee.dniTie}</p>
                </div>
              )}
              
              {employee.idDocument && (
                <div>
                  <p className="text-sm font-medium text-gray-500">ID Document</p>
                  <div className="flex items-center">
                    <p className="text-sm font-semibold truncate max-w-[150px]">{employee.idDocument}</p>
                    <button className="ml-2 px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors">
                      View
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No identification information available</p>
          )}
        </CardContent>
      </Card>
      
      {/* Schedule Card */}
      <Card className="overflow-hidden border-0 shadow-md">
        <div className="bg-gray-50 px-6 py-3 border-b">
          <h3 className="text-md font-medium flex items-center">
            <Clock className="h-4 w-4 mr-2 text-blue-600" />
            Schedule
          </h3>
        </div>
        <CardContent className="pt-4">
          {employee.weeklySchedule ? (
            <div>
              <p className="text-sm font-medium text-gray-500">Weekly Working Schedule</p>
              <p className="text-sm font-semibold whitespace-pre-line mt-1">{employee.weeklySchedule}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No schedule information available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDetailView;
