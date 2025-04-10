
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

interface PeopleTabProps {
  employeeStats: {
    total: number;
    active: number;
    terminated: number;
    recentlyAdded: number;
  };
}

const PeopleTab: React.FC<PeopleTabProps> = ({ employeeStats }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Summary</CardTitle>
        <CardDescription>
          Overview of your employee information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <EmployeeStats employeeStats={employeeStats} />
          <RecentAdditions recentlyAdded={employeeStats.recentlyAdded} />
        </div>
      </CardContent>
    </Card>
  );
};

export default PeopleTab;
