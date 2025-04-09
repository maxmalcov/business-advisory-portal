
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { User } from '../../hooks/useUserManagement';

interface BasicInfoSectionProps {
  user: User;
  onUserChange: (user: User) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ user, onUserChange }) => {
  // Handle changing user type
  const handleChangeUserType = (value: string) => {
    onUserChange({
      ...user,
      userType: value
    });
  };

  return (
    <>
      <div className="space-y-3">
        <Label htmlFor="name" className="font-medium">Name</Label>
        <Input 
          id="name"
          value={user.name}
          onChange={(e) => onUserChange({...user, name: e.target.value})}
          className="w-full"
        />
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="email" className="font-medium">Email</Label>
        <Input 
          id="email"
          value={user.email}
          onChange={(e) => onUserChange({...user, email: e.target.value})}
          className="w-full"
        />
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="company" className="font-medium">Company Name</Label>
        <Input 
          id="company"
          value={user.companyName || ''}
          onChange={(e) => onUserChange({...user, companyName: e.target.value})}
          className="w-full"
        />
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="role" className="font-medium">Role</Label>
        <Select 
          value={user.userType} 
          onValueChange={handleChangeUserType}
        >
          <SelectTrigger id="role" className="w-full">
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
