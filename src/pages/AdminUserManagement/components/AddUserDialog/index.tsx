
import React from 'react';
import { DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User } from '../../hooks/types';
import BasicInfoSection from './BasicInfoSection';
import ContactInfoSection from './ContactInfoSection';
import CredentialsSection from './CredentialsSection';
import IframeUrlsSection from './IframeUrlsSection';
import { useState } from 'react';

interface AddUserDialogProps {
  onSave: (userData: Omit<User, 'id'>) => void;
  onCancel: () => void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ onSave, onCancel }) => {
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({
    name: '',
    email: '',
    userType: 'Client',
    companyName: '',
    active: true
  });
  
  const [isFormValid, setIsFormValid] = useState(false);
  
  const handleUserChange = (updatedUser: Omit<User, 'id'>) => {
    setNewUser(updatedUser);
    // Basic validation - check if name and email are filled
    setIsFormValid(!!updatedUser.name && !!updatedUser.email);
  };

  const handleSaveClick = () => {
    if (isFormValid) {
      onSave(newUser);
    }
  };

  return (
    <DialogContent className="max-w-5xl p-0 h-[90vh] flex flex-col mx-auto w-[95vw]">
      <DialogHeader className="px-6 pt-6 mb-2">
        <DialogTitle className="text-xl">Add New User</DialogTitle>
        <DialogDescription className="mt-2">
          Create a new user account
        </DialogDescription>
      </DialogHeader>
      
      <ScrollArea className="flex-1 px-6 pb-4">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BasicInfoSection newUser={newUser} onUserChange={handleUserChange} />
            <CredentialsSection newUser={newUser} onUserChange={handleUserChange} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ContactInfoSection newUser={newUser} onUserChange={handleUserChange} />
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <IframeUrlsSection 
              newUser={newUser} 
              onUserChange={handleUserChange} 
            />
          </div>
        </div>
      </ScrollArea>
      
      <DialogFooter className="px-6 py-4 border-t bg-muted/20">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSaveClick} disabled={!isFormValid}>
          <Save className="mr-2 h-4 w-4" />
          Create User
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default AddUserDialog;
