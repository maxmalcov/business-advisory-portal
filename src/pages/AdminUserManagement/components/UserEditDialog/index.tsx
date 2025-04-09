
import React, { useEffect, useState } from 'react';
import { DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Save, Edit, Trash2, Power, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/context/LanguageContext';
import BasicInfoSection from './BasicInfoSection';
import ContactInfoSection from './ContactInfoSection';
import AccountInfoSection from './AccountInfoSection';
import LocationInfoSection from './LocationInfoSection';
import IframeUrlsSection from './IframeUrlsSection';
import type { User } from '../../hooks/types';
import { AlertDialog, AlertDialogContent, AlertDialogTrigger, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';

interface UserEditDialogProps {
  user: User;
  onUserChange: (user: User) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (user: User) => void;
  onToggleStatus: (user: User) => void;
}

const UserEditDialog: React.FC<UserEditDialogProps> = ({ 
  user, 
  onUserChange, 
  onSave, 
  onCancel,
  onDelete,
  onToggleStatus
}) => {
  const { t } = useLanguage();
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Log the user data to verify we're receiving correct information
  useEffect(() => {
    console.log("UserEditDialog received user data:", user);
  }, [user]);

  const handleToggleEditMode = () => {
    setIsEditMode(prev => !prev);
  };

  const handleSave = () => {
    onSave();
    setIsEditMode(false);
  };

  return (
    <DialogContent className="max-w-5xl p-0 h-[90vh] flex flex-col mx-auto w-[95vw]">
      <DialogHeader className="px-6 pt-6 mb-2 flex flex-row items-center justify-between">
        <div>
          <DialogTitle className="text-xl">{isEditMode ? 'Edit User' : 'User Details'}</DialogTitle>
          <DialogDescription className="mt-2">
            {isEditMode ? 'Modify user information and settings' : 'View user information and settings'}
          </DialogDescription>
        </div>
        <div className="flex items-center gap-2">
          {!isEditMode ? (
            <Button 
              variant="outline" 
              onClick={handleToggleEditMode}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={handleToggleEditMode}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel Edit
            </Button>
          )}
        </div>
      </DialogHeader>
      
      <ScrollArea className="flex-1 px-6 pb-4">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BasicInfoSection user={user} onUserChange={onUserChange} isReadOnly={!isEditMode} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ContactInfoSection user={user} onUserChange={onUserChange} isReadOnly={!isEditMode} />
            <AccountInfoSection user={user} onUserChange={onUserChange} isReadOnly={!isEditMode} />
          </div>
          
          <LocationInfoSection user={user} onUserChange={onUserChange} isReadOnly={!isEditMode} />
          
          <div className="col-span-1 md:col-span-2">
            <IframeUrlsSection 
              user={user} 
              onUserChange={onUserChange} 
              isReadOnly={!isEditMode}
            />
          </div>
        </div>
      </ScrollArea>
      
      <DialogFooter className="px-6 py-4 border-t bg-muted/20">
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="border-orange-400 text-orange-500 hover:bg-orange-50 hover:text-orange-600"
              onClick={() => onToggleStatus(user)}
            >
              <Power className="h-4 w-4 mr-2" />
              {user.isActive ? "Deactivate User" : "Activate User"}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete User
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the user
                    {user && ` "${user.name}"`} and all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(user)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>Close</Button>
            {isEditMode && (
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            )}
          </div>
        </div>
      </DialogFooter>
    </DialogContent>
  );
};

export default UserEditDialog;
