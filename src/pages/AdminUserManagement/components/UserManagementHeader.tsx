
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

interface UserManagementHeaderProps {
  onAddUser: () => void;
}

const UserManagementHeader: React.FC<UserManagementHeaderProps> = ({ onAddUser }) => {
  return (
    <Card className="border-l-4 border-l-blue-600">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl">User Management</CardTitle>
          <CardDescription>
            View and manage user accounts
          </CardDescription>
        </div>
        <Button 
          onClick={onAddUser}
          variant="default"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </CardHeader>
    </Card>
  );
};

export default UserManagementHeader;
