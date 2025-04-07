
import React from 'react';
import { 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import BasicInfoSection from './BasicInfoSection';
import CredentialsSection from './CredentialsSection';
import ContactInfoSection from './ContactInfoSection';
import IframeUrlsSection from './IframeUrlsSection';
import type { User } from '../../hooks/useUserManagement';

interface AddUserDialogProps {
  onSave: (user: Omit<User, 'id'>) => void;
  onCancel: () => void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ onSave, onCancel }) => {
  // Using a temporary ID for state management, but we'll omit it when saving
  const [newUser, setNewUser] = React.useState<User>({
    id: 'temp-id', // Temporary ID to satisfy TypeScript
    name: '',
    email: '',
    companyName: '',
    userType: 'client',
    incomingInvoiceEmail: '',
    outgoingInvoiceEmail: '',
    iframeUrls: [],
    password: ''
  });
  
  const handleSave = () => {
    // Basic validation
    if (!newUser.name || !newUser.email) {
      alert('Please fill in required fields: Name and Email');
      return;
    }
    
    // Generate a random password if not provided
    if (!newUser.password) {
      newUser.password = Math.random().toString(36).slice(-8);
    }
    
    // Omit the ID when saving as it's not needed for creating a new user
    const { id, ...userWithoutId } = newUser;
    onSave(userWithoutId);
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Add New User</DialogTitle>
        <DialogDescription>
          Create a new user account
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid grid-cols-2 gap-4 py-4">
        <BasicInfoSection 
          newUser={newUser} 
          onUserChange={setNewUser} 
        />
        
        <CredentialsSection 
          newUser={newUser} 
          onUserChange={setNewUser} 
        />
        
        <ContactInfoSection 
          user={newUser} 
          onUserChange={setNewUser} 
        />
        
        <IframeUrlsSection 
          newUser={newUser} 
          onUserChange={setNewUser} 
        />
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Create User
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default AddUserDialog;
