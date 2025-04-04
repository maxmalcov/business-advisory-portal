
import React, { useState } from 'react';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, X, Plus, Save, Link as LinkIcon } from 'lucide-react';
import { User } from '../types';

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
  onCancel,
}) => {
  const [newIframeUrl, setNewIframeUrl] = useState('');

  const handleAddIframeUrl = () => {
    if (!newIframeUrl) return;
    
    onUserChange({
      ...user,
      iframeUrls: [...(user.iframeUrls || []), newIframeUrl]
    });
    
    setNewIframeUrl('');
  };

  const handleRemoveIframeUrl = (index: number) => {
    const newUrls = [...(user.iframeUrls || [])];
    newUrls.splice(index, 1);
    
    onUserChange({
      ...user,
      iframeUrls: newUrls
    });
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Edit User Details</DialogTitle>
        <DialogDescription>
          Update the user's information and settings
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid grid-cols-2 gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
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
          <Label htmlFor="company">Company Name</Label>
          <Input 
            id="company"
            value={user.companyName || ''}
            onChange={(e) => onUserChange({...user, companyName: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select 
            value={user.userType} 
            onValueChange={(value) => onUserChange({...user, userType: value})}
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
              value={user.incomingInvoiceEmail || ''}
              onChange={(e) => onUserChange({...user, incomingInvoiceEmail: e.target.value})}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="outgoing-email">Email for Outgoing Invoices</Label>
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
          <Label>IFRAME URLs</Label>
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
        <Button onClick={onSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default UserEditDialog;
