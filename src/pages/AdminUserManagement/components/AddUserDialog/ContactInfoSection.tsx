import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Phone } from 'lucide-react';
import type { User } from '../../hooks/types';

interface ContactInfoSectionProps {
  newUser: Omit<User, 'id'>;
  onUserChange: (user: Omit<User, 'id'>) => void;
}

const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({
  newUser,
  onUserChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-500" />
          <Label htmlFor="email">Email *</Label>
        </div>
        <Input
          id="email"
          type="email"
          value={newUser.email}
          onChange={(e) => onUserChange({ ...newUser, email: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-500" />
          <Label htmlFor="phone">Phone *</Label>
        </div>
        <Input
          id="phone"
          value={newUser.phone || ''}
          onChange={(e) => onUserChange({ ...newUser, phone: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-500" />
          <Label htmlFor="incoming-email">Email for Incoming Invoices</Label>
        </div>
        <Input
          id="incoming-email"
          value={newUser.incomingInvoiceEmail || ''}
          onChange={(e) =>
            onUserChange({
              ...newUser,
              incomingInvoiceEmail: e.target.value,
            })
          }
          placeholder="email@example.com"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-500" />
          <Label htmlFor="outgoing-email">Email for Outgoing Invoices</Label>
        </div>
        <Input
          id="outgoing-email"
          value={newUser.outgoingInvoiceEmail || ''}
          onChange={(e) =>
            onUserChange({
              ...newUser,
              outgoingInvoiceEmail: e.target.value,
            })
          }
          placeholder="email@example.com"
        />
      </div>
    </div>
  );
};

export default ContactInfoSection;
