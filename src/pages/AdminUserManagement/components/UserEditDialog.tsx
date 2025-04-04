
import React from 'react';
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
import { Mail, Link as LinkIcon, Plus, Save, X } from 'lucide-react';
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

interface UserEditDialogProps {
  user: User;
  onUserChange: (user: User) => void;
  onSave: () => void;
  onCancel: () => void;
}

const UserEditDialog: React.FC<UserEditDialogProps> = ({ 
  user, 
  onUserChange, 
  onSave, 
  onCancel 
}) => {
  const { t } = useLanguage();
  const [newIframeUrl, setNewIframeUrl] = React.useState('');

  // Handle adding a new iframe URL
  const handleAddIframeUrl = () => {
    if (!newIframeUrl) return;
    
    onUserChange({
      ...user,
      iframeUrls: [...(user.iframeUrls || []), newIframeUrl]
    });
    
    setNewIframeUrl('');
  };

  // Handle removing an iframe URL
  const handleRemoveIframeUrl = (index: number) => {
    const newUrls = [...(user.iframeUrls || [])];
    newUrls.splice(index, 1);
    
    onUserChange({
      ...user,
      iframeUrls: newUrls
    });
  };

  // Handle changing user type
  const handleChangeUserType = (value: string) => {
    onUserChange({
      ...user,
      userType: value
    });
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Редактирование пользователя</DialogTitle>
        <DialogDescription>
          Измените информацию и настройки пользователя
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid grid-cols-2 gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Имя</Label>
          <Input 
            id="name"
            value={user.name}
            onChange={(e) => onUserChange({...user, name: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email"
            value={user.email}
            onChange={(e) => onUserChange({...user, email: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company">Название компании</Label>
          <Input 
            id="company"
            value={user.companyName || ''}
            onChange={(e) => onUserChange({...user, companyName: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="role">Роль</Label>
          <Select 
            value={user.userType} 
            onValueChange={handleChangeUserType}
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
              value={user.incomingInvoiceEmail || ''}
              onChange={(e) => onUserChange({...user, incomingInvoiceEmail: e.target.value})}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="outgoing-email">Email для исходящих счетов</Label>
          <div className="flex">
            <Mail className="mr-2 h-4 w-4 mt-2.5" />
            <Input 
              id="outgoing-email"
              value={user.outgoingInvoiceEmail || ''}
              onChange={(e) => onUserChange({...user, outgoingInvoiceEmail: e.target.value})}
            />
          </div>
        </div>
        
        <div className="col-span-2 space-y-2">
          <Label>URL-адреса IFRAME</Label>
          <div className="space-y-2">
            {user.iframeUrls?.map((url: string, index: number) => (
              <div key={index} className="flex items-center">
                <LinkIcon className="mr-2 h-4 w-4" />
                <Input 
                  value={url}
                  onChange={(e) => {
                    const newUrls = [...(user.iframeUrls || [])];
                    newUrls[index] = e.target.value;
                    onUserChange({...user, iframeUrls: newUrls});
                  }}
                  className="flex-grow"
                />
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleRemoveIframeUrl(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <div className="flex items-center mt-2">
              <LinkIcon className="mr-2 h-4 w-4" />
              <Input 
                placeholder="Добавить новый URL"
                value={newIframeUrl}
                onChange={(e) => setNewIframeUrl(e.target.value)}
                className="flex-grow"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleAddIframeUrl}
                className="ml-2"
              >
                <Plus className="h-4 w-4 mr-1" />
                Добавить
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Отмена</Button>
        <Button onClick={onSave}>
          <Save className="mr-2 h-4 w-4" />
          Сохранить изменения
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default UserEditDialog;
