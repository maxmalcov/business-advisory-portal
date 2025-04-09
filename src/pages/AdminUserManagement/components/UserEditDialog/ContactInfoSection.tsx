
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';
import type { User } from '../../hooks/types';

interface ContactInfoSectionProps {
  user: User;
  onUserChange: (user: User) => void;
}

const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({ user, onUserChange }) => {
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
        <Label htmlFor="incoming-email" className="font-medium">Email for Incoming Invoices</Label>
        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-gray-500 flex-shrink-0" />
          <Input 
            id="incoming-email"
            value={user.incomingInvoiceEmail || ''}
            onChange={(e) => onUserChange({...user, incomingInvoiceEmail: e.target.value})}
            className="flex-grow"
            placeholder="email@example.com"
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
            placeholder="email@example.com"
          />
        </div>
      </div>
    </>
  );
};

export default ContactInfoSection;
