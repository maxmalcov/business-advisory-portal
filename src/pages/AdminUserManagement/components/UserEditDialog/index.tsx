
import React from 'react';
import { DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import BasicInfoSection from './BasicInfoSection';
import ContactInfoSection from './ContactInfoSection';
import IframeUrlsSection from './IframeUrlsSection';
import type { User } from '../../hooks/useUserManagement';

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

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Edit User</DialogTitle>
        <DialogDescription>
          Modify user information and settings
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
        <BasicInfoSection user={user} onUserChange={onUserChange} />
        <ContactInfoSection user={user} onUserChange={onUserChange} />
        <IframeUrlsSection 
          user={user} 
          onUserChange={onUserChange} 
        />
      </div>
      
      <DialogFooter className="mt-4">
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
