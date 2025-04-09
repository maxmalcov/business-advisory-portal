
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin } from 'lucide-react';
import type { User } from '../../hooks/types';

interface ContactInfoSectionProps {
  newUser: Omit<User, "id">;
  onUserChange: (user: Omit<User, "id">) => void;
}

const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({ newUser, onUserChange }) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-500" />
          <Input 
            id="phone"
            value={newUser.phone || ''}
            onChange={(e) => onUserChange({...newUser, phone: e.target.value})}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <Input 
            id="address"
            value={newUser.address || ''}
            onChange={(e) => onUserChange({...newUser, address: e.target.value})}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="incoming-email">Email for Incoming Invoices</Label>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-500" />
          <Input 
            id="incoming-email"
            value={newUser.incomingInvoiceEmail || ''}
            onChange={(e) => onUserChange({...newUser, incomingInvoiceEmail: e.target.value})}
            placeholder="email@example.com"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="outgoing-email">Email for Outgoing Invoices</Label>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-500" />
          <Input 
            id="outgoing-email"
            value={newUser.outgoingInvoiceEmail || ''}
            onChange={(e) => onUserChange({...newUser, outgoingInvoiceEmail: e.target.value})}
            placeholder="email@example.com"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="postal-code">Postal Code</Label>
        <Input 
          id="postal-code"
          value={newUser.postalCode || ''}
          onChange={(e) => onUserChange({...newUser, postalCode: e.target.value})}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input 
          id="city"
          value={newUser.city || ''}
          onChange={(e) => onUserChange({...newUser, city: e.target.value})}
        />
      </div>
    </>
  );
};

export default ContactInfoSection;
