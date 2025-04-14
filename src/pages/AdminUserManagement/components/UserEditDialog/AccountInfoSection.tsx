
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, CreditCard, UserCircle } from 'lucide-react';
import type { User, AccountType, UserType as UserRoleType } from '../../hooks/types';

interface AccountInfoSectionProps {
  user: User;
  onUserChange: (user: User) => void;
  isReadOnly?: boolean;
}

const AccountInfoSection: React.FC<AccountInfoSectionProps> = ({ user, onUserChange, isReadOnly = false }) => {
  // Handle changing user type
  const handleChangeUserType = (value: string) => {
    onUserChange({
      ...user,
      userType: value as UserRoleType
    });
  };

  return (
    <div className="space-y-3 p-3 bg-gray-50 rounded-md">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <Label htmlFor="phone" className="text-xs font-medium">Phone Number</Label>
          </div>
          <Input 
            id="phone"
            value={user.phone || ''}
            onChange={(e) => onUserChange({...user, phone: e.target.value})}
            className="w-full h-9"
            readOnly={isReadOnly}
            disabled={isReadOnly}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <Label htmlFor="account-type" className="text-xs font-medium">Account Type</Label>
          </div>
          <Select 
            value={user.accountType || ''} 
            onValueChange={(value) => onUserChange({...user, accountType: value as AccountType})}
            disabled={isReadOnly}
          >
            <SelectTrigger id="account-type" className="w-full h-9">
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

      <div className="grid grid-cols-1 gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <UserCircle className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <Label htmlFor="role" className="text-xs font-medium">Role</Label>
          </div>
          <Select 
            value={user.userType} 
            onValueChange={handleChangeUserType}
            disabled={isReadOnly}
          >
            <SelectTrigger id="role" className="w-full h-9">
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
    </div>
  );
};

export default AccountInfoSection;
