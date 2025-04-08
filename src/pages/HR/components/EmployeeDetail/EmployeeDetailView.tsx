
import React from 'react';
import { Employee } from '../../types/employee';
import { User, Briefcase, Calendar, Clock, FileText, Mail, Home, DollarSign, CreditCard, CheckCircle, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
    <div className="space-y-4">
      {/* Header Section with Avatar and Title - Made more compact */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border border-gray-100">
            <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
              {getInitials(employee.fullName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-bold">{employee.fullName}</h2>
            <p className="text-sm text-gray-500">{employee.position}</p>
          </div>
        </div>
        {employee.status === 'active' ? (
          <div className="bg-green-100 text-green-600 px-3 py-1 rounded-md flex items-center gap-1 text-sm">
            <CheckCircle className="h-3 w-3" />
            <span className="font-medium">Active</span>
          </div>
        ) : (
          <Badge className="bg-red-500">Terminated</Badge>
        )}
      </div>
      
      {/* Basic Information Card - More compact layout */}
      <Card className="overflow-hidden border-0 shadow-sm">
        <div className="bg-gray-50 px-4 py-2 border-b">
          <h3 className="text-sm font-medium flex items-center">
            <User className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
            Basic Information
          </h3>
        </div>
        <CardContent className="pt-3 pb-3 px-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div>
              <p className="font-medium text-gray-500">Company Name</p>
              <p className="font-semibold">{employee.companyName || '-'}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Status</p>
              <p className="font-semibold">{employee.status === 'active' ? 'Active' : 'Terminated'}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Position</p>
              <p className="font-semibold">{employee.position || '-'}</p>
            </div>
            {employee.email && (
              <div>
                <p className="font-medium text-gray-500">Email</p>
                <p className="font-semibold">{employee.email}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Employment Dates Card - More compact */}
      <Card className="overflow-hidden border-0 shadow-sm">
        <div className="bg-gray-50 px-4 py-2 border-b">
          <h3 className="text-sm font-medium flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
            Employment Dates
          </h3>
        </div>
        <CardContent className="pt-3 pb-3 px-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div>
              <p className="font-medium text-gray-500">Start Date</p>
              <p className="font-semibold">{formatDate(employee.startDate)}</p>
            </div>
            {(employee.status === 'terminated' || employee.endDate) && (
              <div>
                <p className="font-medium text-gray-500">End Date</p>
                <p className="font-semibold">{formatDate(employee.endDate)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Identification Card - More compact */}
      <Card className="overflow-hidden border-0 shadow-sm">
        <div className="bg-gray-50 px-4 py-2 border-b">
          <h3 className="text-sm font-medium flex items-center">
            <Briefcase className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
            Identification
          </h3>
        </div>
        <CardContent className="pt-3 pb-3 px-4">
          {employee.dniTie || employee.idDocument || employee.socialSecurityNumber ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {employee.dniTie && (
                <div>
                  <p className="font-medium text-gray-500">DNI/TIE</p>
                  <p className="font-semibold">{employee.dniTie}</p>
                </div>
              )}
              
              {employee.socialSecurityNumber && (
                <div>
                  <p className="font-medium text-gray-500">Social Security Number</p>
                  <p className="font-semibold">{employee.socialSecurityNumber}</p>
                </div>
              )}
              
              {employee.idDocument && (
                <div>
                  <p className="font-medium text-gray-500">ID Document</p>
                  <div className="flex items-center">
                    <p className="font-semibold truncate max-w-[150px]">{employee.idDocument}</p>
                    <Button variant="ghost" size="sm" className="ml-1 h-5 p-0">
                      <FileText className="h-3 w-3" />
                      <span className="sr-only">View document</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No identification information available</p>
          )}
        </CardContent>
      </Card>
      
      {/* Financial Information Card - More compact */}
      {(employee.salary || employee.iban) && (
        <Card className="overflow-hidden border-0 shadow-sm">
          <div className="bg-gray-50 px-4 py-2 border-b">
            <h3 className="text-sm font-medium flex items-center">
              <DollarSign className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
              Financial Information
            </h3>
          </div>
          <CardContent className="pt-3 pb-3 px-4">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {employee.salary && (
                <div>
                  <p className="font-medium text-gray-500">Salary</p>
                  <p className="font-semibold">
                    {employee.salary} EUR {employee.salaryType === 'gross' ? '(Gross)' : '(Net)'}
                  </p>
                </div>
              )}
              
              {employee.iban && (
                <div>
                  <p className="font-medium text-gray-500">IBAN</p>
                  <p className="font-semibold">{employee.iban}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Contact Information - More compact */}
      {employee.address && (
        <Card className="overflow-hidden border-0 shadow-sm">
          <div className="bg-gray-50 px-4 py-2 border-b">
            <h3 className="text-sm font-medium flex items-center">
              <Home className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
              Contact Information
            </h3>
          </div>
          <CardContent className="pt-3 pb-3 px-4">
            <div className="text-sm">
              <p className="font-medium text-gray-500">Address</p>
              <p className="font-semibold">{employee.address}</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Schedule Card - More compact */}
      <Card className="overflow-hidden border-0 shadow-sm">
        <div className="bg-gray-50 px-4 py-2 border-b">
          <h3 className="text-sm font-medium flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
            Schedule
          </h3>
        </div>
        <CardContent className="pt-3 pb-3 px-4">
          {employee.weeklySchedule ? (
            <div className="text-sm">
              <p className="font-medium text-gray-500">Weekly Working Schedule</p>
              <p className="font-semibold whitespace-pre-line">{employee.weeklySchedule}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No schedule information available</p>
          )}
        </CardContent>
      </Card>
      
      {/* Comments Section - More compact */}
      {employee.comments && (
        <Card className="overflow-hidden border-0 shadow-sm">
          <div className="bg-gray-50 px-4 py-2 border-b">
            <h3 className="text-sm font-medium flex items-center">
              <Mail className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
              Additional Comments
            </h3>
          </div>
          <CardContent className="pt-3 pb-3 px-4">
            <p className="text-sm whitespace-pre-line">{employee.comments}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmployeeDetailView;
