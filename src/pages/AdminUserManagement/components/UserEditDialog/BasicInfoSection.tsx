
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, File, Building, UserCircle } from 'lucide-react';
import type { User as UserType } from '../../hooks/types';

interface BasicInfoSectionProps {
  user: UserType;
  onUserChange: (user: UserType) => void;
  isReadOnly?: boolean;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ user, onUserChange, isReadOnly = false }) => {
  // Handle changing user type
  const handleChangeUserType = (value: string) => {
    onUserChange({
      ...user,
      userType: value
    });
  };

  // Log the user data to verify we're receiving correct information for this section
  React.useEffect(() => {
    console.log("BasicInfoSection received user data:", {
      name: user.name,
      email: user.email,
      companyName: user.companyName,
      userType: user.userType
    });
  }, [user]);

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-gray-500 flex-shrink-0" />
          <Label htmlFor="name" className="font-medium">Name</Label>
        </div>
        <Input 
          id="name"
          value={user.name}
          onChange={(e) => onUserChange({...user, name: e.target.value})}
          className="w-full"
          readOnly={isReadOnly}
          disabled={isReadOnly}
        />
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <File className="h-5 w-5 text-gray-500 flex-shrink-0" />
          <Label htmlFor="email" className="font-medium">Email</Label>
        </div>
        <Input 
          id="email"
          value={user.email}
          onChange={(e) => onUserChange({...user, email: e.target.value})}
          className="w-full"
          readOnly={isReadOnly}
          disabled={isReadOnly}
        />
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Building className="h-5 w-5 text-gray-500 flex-shrink-0" />
          <Label htmlFor="company" className="font-medium">Company Name</Label>
        </div>
        <Input 
          id="company"
          value={user.companyName || ''}
          onChange={(e) => onUserChange({...user, companyName: e.target.value})}
          className="w-full"
          readOnly={isReadOnly}
          disabled={isReadOnly}
        />
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <UserCircle className="h-5 w-5 text-gray-500 flex-shrink-0" />
          <Label htmlFor="role" className="font-medium">Role</Label>
        </div>
        <Select 
          value={user.userType} 
          onValueChange={handleChangeUserType}
          disabled={isReadOnly}
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
