
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { User } from '../../hooks/types';

interface ContactInfoSectionProps {
  newUser: Omit<User, 'id'>;
  onUserChange: (user: Omit<User, 'id'>) => void;
}

const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({ newUser, onUserChange }) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="incomingInvoiceEmail">Incoming Invoice Email</Label>
        <Input 
          id="incomingInvoiceEmail"
          value={newUser.incomingInvoiceEmail || ''}
          onChange={(e) => onUserChange({...newUser, incomingInvoiceEmail: e.target.value})}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="outgoingInvoiceEmail">Outgoing Invoice Email</Label>
        <Input 
          id="outgoingInvoiceEmail"
          value={newUser.outgoingInvoiceEmail || ''}
          onChange={(e) => onUserChange({...newUser, outgoingInvoiceEmail: e.target.value})}
        />
      </div>
    </>
  );
};

export default ContactInfoSection;
