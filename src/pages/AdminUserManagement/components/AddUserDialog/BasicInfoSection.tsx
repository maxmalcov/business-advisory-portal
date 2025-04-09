
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { User } from '../../hooks/types';

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
  
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input 
          id="name"
          value={newUser.name}
          onChange={(e) => onUserChange({...newUser, name: e.target.value})}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input 
          id="email"
          value={newUser.email}
          onChange={(e) => onUserChange({...newUser, email: e.target.value})}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="company">Company Name</Label>
        <Input 
          id="company"
          value={newUser.companyName || ''}
          onChange={(e) => onUserChange({...newUser, companyName: e.target.value})}
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
    </>
  );
};

export default BasicInfoSection;
