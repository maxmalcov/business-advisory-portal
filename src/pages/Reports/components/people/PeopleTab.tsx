import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import EmployeeStats from './EmployeeStats';
import UserRegistrationChart from './UserRegistrationChart';
import { EmployeeStats as EmployeeStatsType } from '../../hooks/types';

interface PeopleTabProps {
  employeeStats: EmployeeStatsType;
}

const PeopleTab: React.FC<PeopleTabProps> = ({ employeeStats }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Summary</CardTitle>
          <CardDescription>
            Overview of registered users in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <EmployeeStats employeeStats={employeeStats} />
          </div>
        </CardContent>
      </Card>

      <div className="w-full">
        <UserRegistrationChart
          registrationData={employeeStats.registrationTrends}
        />
      </div>
    </div>
  );
};

export default PeopleTab;
