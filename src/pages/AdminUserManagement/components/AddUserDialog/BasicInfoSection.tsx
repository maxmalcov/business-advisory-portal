
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { User } from '../../hooks/types';
import LanguageSelector from '@/components/LanguageSelector';
import { User as UserIcon, Briefcase, FileType } from 'lucide-react';

interface BasicInfoSectionProps {
  newUser: Omit<User, "id">;
  onUserChange: (user: Omit<User, "id">) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ newUser, onUserChange }) => {
  // Handle changing user type
  const handleChangeUserType = (value: string) => {
    onUserChange({
      ...newUser,
      userType: value
    });
  };

  const handleChangeAccountType = (value: string) => {
    onUserChange({
      ...newUser,
      accountType: value
    });
  };
  
  const isBusinessAccount = ['sl', 'sa', 'freelancer'].includes(newUser.accountType || '');
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="language">Preferred Language</Label>
          <LanguageSelector />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="accountType">Account Type *</Label>
          <Select 
            value={newUser.accountType || 'freelancer'} 
            onValueChange={(value) => handleChangeAccountType(value)}
          >
            <SelectTrigger id="accountType">
              <SelectValue placeholder="Select account type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="freelancer">Freelancer</SelectItem>
              <SelectItem value="sl">SL (Limited Company)</SelectItem>
              <SelectItem value="sa">SA (Corporation)</SelectItem>
              <SelectItem value="individual">Individual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isBusinessAccount ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-gray-500" />
              <Label htmlFor="adminName">Administrator Name</Label>
            </div>
            <Input 
              id="adminName"
              value={newUser.adminName || ''}
              onChange={(e) => onUserChange({...newUser, adminName: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-gray-500" />
              <Label htmlFor="company">Company Name *</Label>
            </div>
            <Input 
              id="company"
              value={newUser.companyName || ''}
              onChange={(e) => onUserChange({...newUser, companyName: e.target.value})}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <UserIcon className="h-4 w-4 text-gray-500" />
            <Label htmlFor="name">Full Name *</Label>
          </div>
          <Input 
            id="name"
            value={newUser.name}
            onChange={(e) => onUserChange({...newUser, name: e.target.value})}
          />
        </div>
      )}
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FileType className="h-4 w-4 text-gray-500" />
          <Label htmlFor="nif">NIF (Tax ID) *</Label>
        </div>
        <Input 
          id="nif"
          value={newUser.nif || ''}
          onChange={(e) => onUserChange({...newUser, nif: e.target.value})}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">User Role *</Label>
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
    </div>
  );
};

export default BasicInfoSection;
