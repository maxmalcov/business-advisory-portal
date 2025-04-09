
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone } from 'lucide-react';
import type { User } from '../../hooks/types';

interface AccountInfoSectionProps {
  user: User;
  onUserChange: (user: User) => void;
  isReadOnly?: boolean;
}

const AccountInfoSection: React.FC<AccountInfoSectionProps> = ({ user, onUserChange, isReadOnly = false }) => {
  React.useEffect(() => {
    console.log("AccountInfoSection received user data:", {
      phone: user.phone,
      accountType: user.accountType
    });
  }, [user]);

  return (
    <>
      <div className="space-y-3">
        <Label htmlFor="phone" className="font-medium">Phone Number</Label>
        <div className="flex items-center gap-3">
          <Phone className="h-5 w-5 text-gray-500 flex-shrink-0" />
          <Input 
            id="phone"
            value={user.phone || ''}
            onChange={(e) => onUserChange({...user, phone: e.target.value})}
            className="flex-grow"
            readOnly={isReadOnly}
            disabled={isReadOnly}
          />
        </div>
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="account-type" className="font-medium">Account Type</Label>
        <Select 
          value={user.accountType || ''} 
          onValueChange={(value) => onUserChange({...user, accountType: value})}
          disabled={isReadOnly}
        >
          <SelectTrigger id="account-type" className="w-full">
            <SelectValue placeholder="Select account type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Personal">Personal</SelectItem>
            <SelectItem value="Business">Business</SelectItem>
            <SelectItem value="Enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default AccountInfoSection;
