
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { 
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
import { User } from '../hooks/useUserManagement';

interface AddUserDialogProps {
  onSave: (user: Omit<User, 'id'>) => void;
  onCancel: () => void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ onSave, onCancel }) => {
  const { t } = useLanguage();
  const [newUser, setNewUser] = React.useState<Omit<User, 'id'>>({
    name: '',
    email: '',
    companyName: '',
    userType: 'client',
    incomingInvoiceEmail: '',
    outgoingInvoiceEmail: '',
    iframeUrls: []
  });
  const [newIframeUrl, setNewIframeUrl] = React.useState('');

  const handleAddIframeUrl = () => {
    if (!newIframeUrl) return;
    
    setNewUser({
      ...newUser,
      iframeUrls: [...(newUser.iframeUrls || []), newIframeUrl]
    });
    
    setNewIframeUrl('');
  };

  const handleRemoveIframeUrl = (index: number) => {
    const newUrls = [...(newUser.iframeUrls || [])];
    newUrls.splice(index, 1);
    
    setNewUser({
      ...newUser,
      iframeUrls: newUrls
    });
  };

  const handleChangeUserType = (value: string) => {
    setNewUser({
      ...newUser,
      userType: value
    });
  };

  const handleSave = () => {
    if (!newUser.name || !newUser.email) {
      alert('Please fill in required fields: Name and Email');
      return;
    }
    
    onSave(newUser);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Add New User</DialogTitle>
        <DialogDescription>
          Create a new user account
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid grid-cols-2 gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input 
            id="name"
            value={newUser.name}
            onChange={(e) => setNewUser({...newUser, name: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input 
            id="email"
            value={newUser.email}
            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company">Company Name</Label>
          <Input 
            id="company"
            value={newUser.companyName || ''}
            onChange={(e) => setNewUser({...newUser, companyName: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select 
            value={newUser.userType} 
            onValueChange={handleChangeUserType}
          >
            <SelectTrigger id="role">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="client">Client</SelectItem>
              <SelectItem value="admin">Administrator</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="incoming-email">Email for Incoming Invoices</Label>
          <div className="flex">
            <Mail className="mr-2 h-4 w-4 mt-2.5" />
            <Input 
              id="incoming-email"
              value={newUser.incomingInvoiceEmail || ''}
              onChange={(e) => setNewUser({...newUser, incomingInvoiceEmail: e.target.value})}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="outgoing-email">Email for Outgoing Invoices</Label>
          <div className="flex">
            <Mail className="mr-2 h-4 w-4 mt-2.5" />
            <Input 
              id="outgoing-email"
              value={newUser.outgoingInvoiceEmail || ''}
              onChange={(e) => setNewUser({...newUser, outgoingInvoiceEmail: e.target.value})}
            />
          </div>
        </div>
        
        <div className="col-span-2 space-y-2">
          <Label>IFRAME URLs</Label>
          <div className="space-y-2">
            {newUser.iframeUrls?.map((url: string, index: number) => (
              <div key={index} className="flex items-center">
                <LinkIcon className="mr-2 h-4 w-4" />
                <Input 
                  value={url}
                  onChange={(e) => {
                    const newUrls = [...(newUser.iframeUrls || [])];
                    newUrls[index] = e.target.value;
                    setNewUser({...newUser, iframeUrls: newUrls});
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
                placeholder="Add new URL"
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
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Create User
        </Button>
      </DialogFooter>
    </>
  );
};

export default AddUserDialog;
