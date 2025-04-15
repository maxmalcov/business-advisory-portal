
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import EmployeeStats from './EmployeeStats';
import RecentAdditions from './RecentAdditions';
import RecentRegistrationsList from './RecentRegistrationsList';
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <RecentRegistrationsList recentlyAdded={employeeStats.recentlyAdded} />
              <RecentAdditions recentlyAdded={employeeStats.recentlyAdded} />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="w-full">
        <UserRegistrationChart registrationData={employeeStats.registrationTrends} />
      </div>
    </div>
  );
};

export default PeopleTab;
