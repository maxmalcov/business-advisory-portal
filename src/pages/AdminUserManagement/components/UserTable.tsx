
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { UserCog, Trash2, Ban, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface User {
  id: string;
  name: string;
  email: string;
  companyName?: string;
  userType: string;
  incomingInvoiceEmail?: string;
  outgoingInvoiceEmail?: string;
  iframeUrls?: string[];
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
          <TableHead>Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4">
              Пользователи не найдены
            </TableCell>
          </TableRow>
        ) : (
          users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.companyName || '-'}</TableCell>
              <TableCell>
                <Badge variant={user.userType === 'admin' ? 'default' : 'outline'}>
                  {user.userType === 'admin' ? 'Администратор' : 
                   user.userType === 'manager' ? 'Менеджер' : 'Клиент'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={user.isActive === false ? 'destructive' : 'secondary'}>
                  {user.isActive === false ? 'Неактивен' : 'Активен'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditUser(user)}
                  >
                    <UserCog className="h-4 w-4 mr-1" />
                    Изменить
                  </Button>
                  
                  <Button
                    variant={user.isActive === false ? "outline" : "secondary"}
                    size="sm"
                    onClick={() => onToggleStatus(user)}
                  >
                    {user.isActive === false ? (
                      <><CheckCircle className="h-4 w-4 mr-1" />Активировать</>
                    ) : (
                      <><Ban className="h-4 w-4 mr-1" />Деактивировать</>
                    )}
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeleteUser(user)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Удалить
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default UserTable;
