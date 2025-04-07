
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const UserManagementHeader: React.FC = () => {
  return (
    <Card className="border-l-4 border-l-blue-600">
      <CardHeader>
        <CardTitle className="text-2xl">Управление пользователями</CardTitle>
        <CardDescription>
          Просмотр и управление учетными записями пользователей
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default UserManagementHeader;
