
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';
import type { User } from '../../hooks/useUserManagement';

interface ContactInfoSectionProps {
  user: User;
  onUserChange: (user: User) => void;
}

const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({ user, onUserChange }) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="incoming-email">Email for Incoming Invoices</Label>
        <div className="flex">
          <Mail className="mr-2 h-4 w-4 mt-2.5" />
          <Input 
            id="incoming-email"
            value={user.incomingInvoiceEmail || ''}
            onChange={(e) => onUserChange({...user, incomingInvoiceEmail: e.target.value})}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="outgoing-email">Email for Outgoing Invoices</Label>
        <div className="flex">
          <Mail className="mr-2 h-4 w-4 mt-2.5" />
          <Input 
            id="outgoing-email"
            value={user.outgoingInvoiceEmail || ''}
            onChange={(e) => onUserChange({...user, outgoingInvoiceEmail: e.target.value})}
          />
        </div>
      </div>
    </>
  );
};

export default ContactInfoSection;
