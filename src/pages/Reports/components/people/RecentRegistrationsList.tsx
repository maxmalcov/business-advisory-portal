
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface RecentRegistrationsListProps {
  recentlyAdded: number;
}

const RecentRegistrationsList: React.FC<RecentRegistrationsListProps> = ({ recentlyAdded }) => {
  const navigate = useNavigate();

  const handleManageUsers = () => {
    navigate('/admin/users');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Recent User Registrations</CardTitle>
        <CardDescription>
          Users registered in the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-6">
        <div className="text-7xl font-bold mb-2">{recentlyAdded}</div>
        <p className="text-muted-foreground text-lg">New users</p>
      </CardContent>
      <CardFooter className="flex justify-center pb-6">
        <Button onClick={handleManageUsers} size="lg">
          Manage Users
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecentRegistrationsList;
