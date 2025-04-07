import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  UserCog, 
  Trash2, 
  UserX, 
  UserCheck 
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

// Define the User interface
interface User {
  id: string;
  name: string;
  email: string;
  companyName?: string;
  userType: string;
  isActive?: boolean;
}

interface UserTableProps {
  users: User[];
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onToggleStatus: (user: User) => void;
}

const UserTable: React.FC<UserTableProps> = ({ 
  users, 
  onEditUser, 
  onDeleteUser, 
  onToggleStatus 
}) => {
  const { t } = useLanguage();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Имя</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Компания</TableHead>
          <TableHead>Роль</TableHead>
          <TableHead>Статус</TableHead>
          <TableHead className="text-right">Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.companyName}</TableCell>
            <TableCell className="capitalize">{user.userType}</TableCell>
            <TableCell>
              <Badge variant={user.isActive ? "default" : "secondary"}>
                {user.isActive ? "Активен" : "Неактивен"}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEditUser(user)}
              >
                <UserCog className="h-4 w-4 mr-2" />
                {t('Edit')}
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => onDeleteUser(user)}
                className="ml-2"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t('Delete')}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleStatus(user)}
                className="ml-2"
              >
                {user.isActive ? (
                  <UserX className="h-4 w-4 mr-2 text-red-500" />
                ) : (
                  <UserCheck className="h-4 w-4 mr-2 text-green-500" />
                )}
                {user.isActive ? t('Deactivate') : t('Activate')}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTable;
