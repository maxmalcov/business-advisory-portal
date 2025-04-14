
import React, { useEffect, useState } from 'react';
import { DialogFooter, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Save, Edit, Trash2, Power, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/context/LanguageContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import BasicInfoSection from './BasicInfoSection';
import ContactInfoSection from './ContactInfoSection';
import AccountInfoSection from './AccountInfoSection';
import LocationInfoSection from './LocationInfoSection';
import IframeUrlsSection from './IframeUrlsSection';
import ActivityTabContent from './ActivityTabContent';
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
  const [activeTab, setActiveTab] = useState("details");

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
    <>
      <DialogHeader className="px-6 pt-4 pb-2 flex flex-row items-center justify-between">
        <div>
          <DialogTitle className="text-xl">{isEditMode ? 'Edit User' : 'User Details'}</DialogTitle>
          <DialogDescription className="mt-1">
            {isEditMode ? 'Modify user information and settings' : 'View user information and settings'}
          </DialogDescription>
        </div>
        <div className="flex items-center gap-2">
          {!isEditMode ? (
            <Button 
              variant="outline" 
              onClick={handleToggleEditMode}
              size="sm"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={handleToggleEditMode}
              size="sm"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel Edit
            </Button>
          )}
        </div>
      </DialogHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-6 border-b">
          <TabsList className="gap-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="activity">Activity & Account</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="details" className="flex-1 flex flex-col data-[state=active]:flex data-[state=inactive]:hidden">
          <ScrollArea className="flex-1 px-6 py-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BasicInfoSection user={user} onUserChange={onUserChange} isReadOnly={!isEditMode} />
                <div className="grid grid-cols-1 gap-4">
                  <AccountInfoSection user={user} onUserChange={onUserChange} isReadOnly={!isEditMode} />
                  
                  {/* Highlighted Invoice Email Section */}
                  <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
                    <h3 className="text-sm font-medium text-blue-700 mb-3">Invoice Email Settings</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-blue-500 flex-shrink-0" />
                          <Label htmlFor="incoming-invoice-email" className="text-xs font-medium text-blue-700">Email for Incoming Invoices</Label>
                        </div>
                        <Input 
                          id="incoming-invoice-email"
                          value={user.incomingInvoiceEmail || ''}
                          onChange={(e) => onUserChange({...user, incomingInvoiceEmail: e.target.value})}
                          className="w-full h-9 border-blue-200 focus:border-blue-400"
                          placeholder="incoming@example.com"
                          readOnly={isReadOnly}
                          disabled={isReadOnly}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-blue-500 flex-shrink-0" />
                          <Label htmlFor="outgoing-invoice-email" className="text-xs font-medium text-blue-700">Email for Outgoing Invoices</Label>
                        </div>
                        <Input 
                          id="outgoing-invoice-email"
                          value={user.outgoingInvoiceEmail || ''}
                          onChange={(e) => onUserChange({...user, outgoingInvoiceEmail: e.target.value})}
                          className="w-full h-9 border-blue-200 focus:border-blue-400"
                          placeholder="outgoing@example.com"
                          readOnly={isReadOnly}
                          disabled={isReadOnly}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <LocationInfoSection user={user} onUserChange={onUserChange} isReadOnly={!isEditMode} />
              
              <IframeUrlsSection 
                user={user} 
                onUserChange={onUserChange} 
                isReadOnly={!isEditMode}
              />
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="activity" className="flex-1 flex flex-col data-[state=active]:flex data-[state=inactive]:hidden">
          <ActivityTabContent userId={user.id} />
        </TabsContent>
      </Tabs>
      
      <DialogFooter className="px-6 py-3 border-t bg-muted/20">
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="border-orange-400 text-orange-500 hover:bg-orange-50 hover:text-orange-600"
              onClick={() => onToggleStatus(user)}
              size="sm"
            >
              <Power className="h-4 w-4 mr-2" />
              {user.isActive ? "Deactivate User" : "Activate User"}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
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
            <DialogClose asChild>
              <Button variant="outline" onClick={onCancel} size="sm">Close</Button>
            </DialogClose>
            {isEditMode && (
              <Button onClick={handleSave} size="sm">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            )}
          </div>
        </div>
      </DialogFooter>
    </>
  );
};

export default UserEditDialog;
