
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { Plus } from 'lucide-react';

interface UserManagementHeaderProps {
  onAddUser: () => void;
}

const UserManagementHeader: React.FC<UserManagementHeaderProps> = ({ onAddUser }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground mt-1">
              View, manage, and support registered client accounts across the platform
            </p>
          </div>
        </div>
        <Button onClick={onAddUser}>
          <Plus className="h-4 w-4 mr-1" />
          Add New User
        </Button>
      </div>
    </div>
  );
};

export default UserManagementHeader;
