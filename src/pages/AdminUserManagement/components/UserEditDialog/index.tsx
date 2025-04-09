
import React, { useEffect } from 'react';
import { DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import BasicInfoSection from './BasicInfoSection';
import ContactInfoSection from './ContactInfoSection';
import AccountInfoSection from './AccountInfoSection';
import LocationInfoSection from './LocationInfoSection';
import IframeUrlsSection from './IframeUrlsSection';
import type { User } from '../../hooks/types';

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

  // Log the user data to verify we're receiving correct information
  useEffect(() => {
    console.log("UserEditDialog received user data:", user);
  }, [user]);

  return (
    <DialogContent className="max-w-2xl p-6">
      <DialogHeader className="mb-6">
        <DialogTitle className="text-xl">Edit User</DialogTitle>
        <DialogDescription className="mt-2">
          Modify user information and settings
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BasicInfoSection user={user} onUserChange={onUserChange} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ContactInfoSection user={user} onUserChange={onUserChange} />
          <AccountInfoSection user={user} onUserChange={onUserChange} />
        </div>
        
        <LocationInfoSection user={user} onUserChange={onUserChange} />
        
        <div className="col-span-1 md:col-span-2">
          <IframeUrlsSection 
            user={user} 
            onUserChange={onUserChange} 
          />
        </div>
      </div>
      
      <DialogFooter className="mt-8">
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
