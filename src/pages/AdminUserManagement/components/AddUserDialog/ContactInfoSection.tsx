
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { User } from '../../hooks/useUserManagement';

interface ContactInfoSectionProps {
  user: User;
  onUserChange: (user: User) => void;
}

const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({ user, onUserChange }) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="incomingInvoiceEmail">Incoming Invoice Email</Label>
        <Input 
          id="incomingInvoiceEmail"
          value={user.incomingInvoiceEmail || ''}
          onChange={(e) => onUserChange({...user, incomingInvoiceEmail: e.target.value})}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="outgoingInvoiceEmail">Outgoing Invoice Email</Label>
        <Input 
          id="outgoingInvoiceEmail"
          value={user.outgoingInvoiceEmail || ''}
          onChange={(e) => onUserChange({...user, outgoingInvoiceEmail: e.target.value})}
        />
      </div>
    </>
  );
};

export default ContactInfoSection;
