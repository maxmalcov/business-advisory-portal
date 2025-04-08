
import React from 'react';
import { Employee } from '../../types/employee';
import { User, Briefcase, Calendar, Clock, FileText, Mail, Home, DollarSign, CreditCard, CheckCircle, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { IdentificationSection } from './index';

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
        {employee.status === 'active' ? (
          <div className="bg-green-100 text-green-600 px-4 py-2 rounded-md flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span className="font-medium">Active</span>
          </div>
        ) : (
          <Badge className="bg-red-500">Terminated</Badge>
        )}
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
            <div>
              <p className="text-sm font-medium text-gray-500">Position</p>
              <p className="text-sm font-semibold">{employee.position || '-'}</p>
            </div>
            {employee.email && (
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-sm font-semibold">{employee.email}</p>
              </div>
            )}
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
      
      {/* Identification Card - Using the dedicated component */}
      <IdentificationSection employee={employee} />
      
      {/* Financial Information Card */}
      {(employee.salary || employee.iban) && (
        <Card className="overflow-hidden border-0 shadow-md">
          <div className="bg-gray-50 px-6 py-3 border-b">
            <h3 className="text-md font-medium flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-blue-600" />
              Financial Information
            </h3>
          </div>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 gap-4">
              {employee.salary && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Salary</p>
                  <p className="text-sm font-semibold">
                    {employee.salary} EUR {employee.salaryType === 'gross' ? '(Gross)' : '(Net)'}
                  </p>
                </div>
              )}
              
              {employee.iban && (
                <div>
                  <p className="text-sm font-medium text-gray-500">IBAN</p>
                  <p className="text-sm font-semibold">{employee.iban}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Contact Information */}
      {employee.address && (
        <Card className="overflow-hidden border-0 shadow-md">
          <div className="bg-gray-50 px-6 py-3 border-b">
            <h3 className="text-md font-medium flex items-center">
              <Home className="h-4 w-4 mr-2 text-blue-600" />
              Contact Information
            </h3>
          </div>
          <CardContent className="pt-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Address</p>
              <p className="text-sm font-semibold">{employee.address}</p>
            </div>
          </CardContent>
        </Card>
      )}
      
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
      
      {/* Comments Section */}
      {employee.comments && (
        <Card className="overflow-hidden border-0 shadow-md">
          <div className="bg-gray-50 px-6 py-3 border-b">
            <h3 className="text-md font-medium flex items-center">
              <Mail className="h-4 w-4 mr-2 text-blue-600" />
              Additional Comments
            </h3>
          </div>
          <CardContent className="pt-4">
            <p className="text-sm whitespace-pre-line">{employee.comments}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmployeeDetailView;
