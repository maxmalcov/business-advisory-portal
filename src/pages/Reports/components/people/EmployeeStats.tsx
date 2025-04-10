
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';

interface EmployeeStatsProps {
  employeeStats: {
    total: number;
    active: number;
    terminated: number;
  };
}

const EmployeeStats: React.FC<EmployeeStatsProps> = ({ employeeStats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Total Employees
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{employeeStats.total}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-600">
            Active Employees
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{employeeStats.active}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-red-600">
            Terminated Employees
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{employeeStats.terminated}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeStats;
