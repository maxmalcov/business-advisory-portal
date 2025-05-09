import React from 'react';
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, UserType, AccountType } from '../../hooks/types';
import BasicInfoSection from './BasicInfoSection';
import ContactInfoSection from './ContactInfoSection';
import CredentialsSection from './CredentialsSection';
import IframeUrlsSection from './IframeUrlsSection';
import LocationInfoSection from './LocationInfoSection';
import { useState, useEffect } from 'react';
import {isEmail} from "validator";
import {toast} from "@/components/ui/use-toast.ts";

interface AddUserDialogProps {
  onSave: (userData: Omit<User, 'id'>) => void;
  onCancel: () => void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ onSave, onCancel }) => {
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({
    name: '',
    email: '',
    userType: 'client' as UserType,
    accountType: 'freelancer' as AccountType,
    isActive: true,
    companyName: '',
    password: '',
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUserChange = (updatedUser: Omit<User, 'id'>) => {
    setNewUser(updatedUser);
    validateForm(updatedUser);
  };

  // Validate the form
  const validateForm = (user: Omit<User, 'id'>) => {
    const isBusinessAccount = ['sl', 'sa', 'freelancer'].includes(
      user.accountType || '',
    );

    // Required fields for all users
    const requiredFields = [
      user.email,
      user.userType,
      user.password,
      user.phone,
      user.nif,
      user.address,
      user.postalCode,
      user.city,
      user.province,
      user.country,
      user.name
    ];

    // Add conditional required fields based on account type
    if (isBusinessAccount) {
      requiredFields.push(user.companyName);
    }

    // Check if all required fields are filled
    const allFieldsFilled = requiredFields.every(
      (field) => field && field.trim().length > 0,
    );

    // Check if passwords match (assuming confirmPassword is tracked in state)
    const passwordsMatch = user.password === confirmPassword;

    setIsFormValid(allFieldsFilled && passwordsMatch);
  };

  useEffect(() => {
    // Initialize the form with default values
    validateForm(newUser);
  }, [newUser, confirmPassword]);

  const handleSaveClick = () => {
    if(!isEmail(newUser.email) || !isEmail(newUser.outgoingInvoiceEmail) || !isEmail(newUser.incomingInvoiceEmail)){
      toast({
        title: 'Invalid email',
        description: 'Please put valid email',
        variant: 'destructive'
      })
      return
    }
    if(newUser.password.length < 6){
      toast({
        title: 'Invalid password',
        description: 'Password should be at least 6 characters',
        variant: 'destructive'
      })
      return
    }

    if (isFormValid) {
      onSave(newUser);
    }
  };

  return (
    <DialogContent className="max-w-5xl p-0 h-[90vh] flex flex-col mx-auto w-[95vw]">
      <DialogHeader className="px-6 pt-6 mb-2">
        <DialogTitle className="text-xl">Add New User</DialogTitle>
        <DialogDescription className="mt-2">
          Create a new user account with all required information
        </DialogDescription>
      </DialogHeader>

      <ScrollArea className="flex-1 px-6 pb-4">
        <div className="space-y-8">
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Basic Information</h3>
            <BasicInfoSection
              newUser={newUser}
              onUserChange={handleUserChange}
            />
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Contact Information</h3>
            <ContactInfoSection
              newUser={newUser}
              onUserChange={handleUserChange}
            />
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Location Details</h3>
            <LocationInfoSection
              newUser={newUser}
              onUserChange={handleUserChange}
            />
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Security Credentials</h3>
            <CredentialsSection
              newUser={newUser}
              onUserChange={handleUserChange}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
            />
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Additional Settings</h3>
            <IframeUrlsSection
              newUser={newUser}
              onUserChange={handleUserChange}
            />
          </div>
        </div>
      </ScrollArea>

      <DialogFooter className="px-6 py-4 border-t bg-muted/20">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSaveClick} disabled={!isFormValid}>
          <Save className="mr-2 h-4 w-4" />
          Create User
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default AddUserDialog;
