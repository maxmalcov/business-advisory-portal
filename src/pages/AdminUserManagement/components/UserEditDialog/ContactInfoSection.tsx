
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
  return (
    <div className="space-y-4 p-3 bg-gray-50 rounded-md">
      <h3 className="text-sm font-medium text-gray-700">Contact Information</h3>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
          <Label htmlFor="incoming-email" className="text-xs font-medium">Email for Incoming Invoices</Label>
        </div>
        <Input 
          id="incoming-email"
          value={user.incomingInvoiceEmail || ''}
          onChange={(e) => onUserChange({...user, incomingInvoiceEmail: e.target.value})}
          className="w-full h-9"
          placeholder="email@example.com"
          readOnly={isReadOnly}
          disabled={isReadOnly}
        />
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
          <Label htmlFor="outgoing-email" className="text-xs font-medium">Email for Outgoing Invoices</Label>
        </div>
        <Input 
          id="outgoing-email"
          value={user.outgoingInvoiceEmail || ''}
          onChange={(e) => onUserChange({...user, outgoingInvoiceEmail: e.target.value})}
          className="w-full h-9"
          placeholder="email@example.com"
          readOnly={isReadOnly}
          disabled={isReadOnly}
        />
      </div>
    </div>
  );
};

export default ContactInfoSection;
