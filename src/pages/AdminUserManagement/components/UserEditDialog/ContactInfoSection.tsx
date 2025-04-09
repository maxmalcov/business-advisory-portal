
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';
import type { User } from '../../hooks/types';

interface ContactInfoSectionProps {
  user: User;
  onUserChange: (user: User) => void;
  isReadOnly?: boolean;
}

const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({ user, onUserChange, isReadOnly = false }) => {
  // Log the user data to verify we're receiving correct information for this section
  React.useEffect(() => {
    console.log("ContactInfoSection received user data:", {
      email: user.email,
      incomingInvoiceEmail: user.incomingInvoiceEmail,
      outgoingInvoiceEmail: user.outgoingInvoiceEmail
    });
  }, [user]);

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-gray-500 flex-shrink-0" />
          <Label htmlFor="incoming-email" className="font-medium">Email for Incoming Invoices</Label>
        </div>
        <Input 
          id="incoming-email"
          value={user.incomingInvoiceEmail || ''}
          onChange={(e) => onUserChange({...user, incomingInvoiceEmail: e.target.value})}
          className="flex-grow"
          placeholder="email@example.com"
          readOnly={isReadOnly}
          disabled={isReadOnly}
        />
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-gray-500 flex-shrink-0" />
          <Label htmlFor="outgoing-email" className="font-medium">Email for Outgoing Invoices</Label>
        </div>
        <Input 
          id="outgoing-email"
          value={user.outgoingInvoiceEmail || ''}
          onChange={(e) => onUserChange({...user, outgoingInvoiceEmail: e.target.value})}
          className="flex-grow"
          placeholder="email@example.com"
          readOnly={isReadOnly}
          disabled={isReadOnly}
        />
      </div>
    </>
  );
};

export default ContactInfoSection;
