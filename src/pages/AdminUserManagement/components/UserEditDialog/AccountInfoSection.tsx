
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, CreditCard } from 'lucide-react';
import type { User, AccountType } from '../../hooks/types';

interface AccountInfoSectionProps {
  user: User;
  onUserChange: (user: User) => void;
  isReadOnly?: boolean;
}

const AccountInfoSection: React.FC<AccountInfoSectionProps> = ({ user, onUserChange, isReadOnly = false }) => {
  return (
    <div className="space-y-4 p-3 bg-gray-50 rounded-md">
      <h3 className="text-sm font-medium text-gray-700">Account Information</h3>
      
      <div className="space-y-3">
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
      
      <div className="space-y-3">
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
  );
};

export default AccountInfoSection;
