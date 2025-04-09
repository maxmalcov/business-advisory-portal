
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Phone, CreditCard } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { User } from '../../hooks/useUserManagement';

interface ContactInfoSectionProps {
  user: User;
  onUserChange: (user: User) => void;
}

const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({ user, onUserChange }) => {
  // Log the user data to verify we're receiving correct information for this section
  React.useEffect(() => {
    console.log("ContactInfoSection received user data:", {
      incomingInvoiceEmail: user.incomingInvoiceEmail,
      outgoingInvoiceEmail: user.outgoingInvoiceEmail,
      phone: user.phone,
      nif: user.nif,
      accountType: user.accountType
    });
  }, [user]);

  return (
    <>
      <div className="space-y-3">
        <Label htmlFor="incoming-email" className="font-medium">Email for Incoming Invoices</Label>
        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-gray-500 flex-shrink-0" />
          <Input 
            id="incoming-email"
            value={user.incomingInvoiceEmail || ''}
            onChange={(e) => onUserChange({...user, incomingInvoiceEmail: e.target.value})}
            className="flex-grow"
            placeholder="Enter email for incoming invoices"
          />
        </div>
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="outgoing-email" className="font-medium">Email for Outgoing Invoices</Label>
        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-gray-500 flex-shrink-0" />
          <Input 
            id="outgoing-email"
            value={user.outgoingInvoiceEmail || ''}
            onChange={(e) => onUserChange({...user, outgoingInvoiceEmail: e.target.value})}
            className="flex-grow"
            placeholder="Enter email for outgoing invoices"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="phone" className="font-medium">Phone Number</Label>
        <div className="flex items-center gap-3">
          <Phone className="h-5 w-5 text-gray-500 flex-shrink-0" />
          <Input 
            id="phone"
            value={user.phone || ''}
            onChange={(e) => onUserChange({...user, phone: e.target.value})}
            className="flex-grow"
            placeholder="Enter phone number"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="nif" className="font-medium">NIF/Tax ID</Label>
        <div className="flex items-center gap-3">
          <CreditCard className="h-5 w-5 text-gray-500 flex-shrink-0" />
          <Input 
            id="nif"
            value={user.nif || ''}
            onChange={(e) => onUserChange({...user, nif: e.target.value})}
            className="flex-grow"
            placeholder="Enter NIF/Tax ID"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="account-type" className="font-medium">Account Type</Label>
        <Select 
          value={user.accountType || ''} 
          onValueChange={(value) => onUserChange({...user, accountType: value})}
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

export default ContactInfoSection;
