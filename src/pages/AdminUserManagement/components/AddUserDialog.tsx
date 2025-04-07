import React, { useState } from 'react';
import { 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, UserPlus } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

// Define the User interface
interface User {
  id: string;
  name: string;
  email: string;
  companyName?: string;
  userType: string;
  incomingInvoiceEmail?: string;
  outgoingInvoiceEmail?: string;
  iframeUrls?: string[];
}

interface AddUserDialogProps {
  onSave: (newUser: Omit<User, 'id'>) => void;
  onCancel: () => void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ onSave, onCancel }) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [userType, setUserType] = useState('client');
  const [incomingInvoiceEmail, setIncomingInvoiceEmail] = useState('');
  const [outgoingInvoiceEmail, setOutgoingInvoiceEmail] = useState('');

  const handleSave = () => {
    const newUser = {
      name,
      email,
      companyName,
      userType,
      incomingInvoiceEmail,
      outgoingInvoiceEmail,
      iframeUrls: []
    };
    onSave(newUser);
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Добавить нового пользователя</DialogTitle>
        <DialogDescription>
          Заполните форму ниже, чтобы создать нового пользователя
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid grid-cols-2 gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Имя</Label>
          <Input 
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company">Название компании</Label>
          <Input 
            id="company"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="role">Роль</Label>
          <Select 
            value={userType} 
            onValueChange={setUserType}
          >
            <SelectTrigger id="role">
              <SelectValue placeholder="Выберите роль" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="client">Клиент</SelectItem>
              <SelectItem value="admin">Администратор</SelectItem>
              <SelectItem value="manager">Менеджер</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="incoming-email">Email для входящих счетов</Label>
          <div className="flex">
            <Mail className="mr-2 h-4 w-4 mt-2.5" />
            <Input 
              id="incoming-email"
              value={incomingInvoiceEmail}
              onChange={(e) => setIncomingInvoiceEmail(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="outgoing-email">Email для исходящих счетов</Label>
          <div className="flex">
            <Mail className="mr-2 h-4 w-4 mt-2.5" />
            <Input 
              id="outgoing-email"
              value={outgoingInvoiceEmail}
              onChange={(e) => setOutgoingInvoiceEmail(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Отмена</Button>
        <Button onClick={handleSave}>
          <UserPlus className="mr-2 h-4 w-4" />
          Создать пользователя
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default AddUserDialog;
