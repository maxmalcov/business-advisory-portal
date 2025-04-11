
import React from 'react';
import EmployeeStats from './EmployeeStats';
import RecentAdditions from './RecentAdditions';
import { EmployeeStats as EmployeeStatsType } from '../../hooks/types';

interface PeopleTabProps {
  employeeStats: EmployeeStatsType;
}

const PeopleTab: React.FC<PeopleTabProps> = ({ employeeStats }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">User Statistics</h2>
        <EmployeeStats employeeStats={employeeStats} />
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Recently Added Users</h2>
        <RecentAdditions />
      </div>
    </div>
  );
};

export default PeopleTab;
