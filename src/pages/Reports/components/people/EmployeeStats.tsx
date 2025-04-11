
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EmployeeStats as EmployeeStatsType } from '../../hooks/types';
import { UsersRound } from 'lucide-react';

interface EmployeeStatsProps {
  employeeStats: EmployeeStatsType;
}

const EmployeeStats: React.FC<EmployeeStatsProps> = ({ employeeStats }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <UsersRound className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{employeeStats.active}</div>
          <p className="text-xs text-muted-foreground">
            {employeeStats.recentlyAdded} added in last 30 days
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <UsersRound className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{employeeStats.total}</div>
          <p className="text-xs text-muted-foreground">
            Including inactive accounts
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
          <UsersRound className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{employeeStats.terminated}</div>
          <p className="text-xs text-muted-foreground">
            Deactivated or suspended accounts
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeStats;
