
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { UsersRound } from 'lucide-react';

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
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">
            Total Registered Users
          </CardTitle>
          <UsersRound className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{employeeStats.total}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-green-600">
            Active Users
          </CardTitle>
          <UsersRound className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{employeeStats.active}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-blue-600">
            New Users (30 Days)
          </CardTitle>
          <UsersRound className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{employeeStats.recentlyAdded}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeStats;
