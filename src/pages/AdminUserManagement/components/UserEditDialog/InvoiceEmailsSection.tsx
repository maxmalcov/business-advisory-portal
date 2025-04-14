
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';
import type { User } from '../../hooks/types';

interface InvoiceEmailsSectionProps {
  user: User;
  onUserChange: (user: User) => void;
  isReadOnly?: boolean;
}

const InvoiceEmailsSection: React.FC<InvoiceEmailsSectionProps> = ({ user, onUserChange, isReadOnly = false }) => {
  return (
    <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
      <h3 className="text-sm font-medium text-blue-700 mb-3">Invoice Email Settings</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-blue-500 flex-shrink-0" />
            <Label htmlFor="incoming-invoice-email" className="text-xs font-medium text-blue-700">Email for Incoming Invoices</Label>
          </div>
          <Input 
            id="incoming-invoice-email"
            value={user.incomingInvoiceEmail || ''}
            onChange={(e) => onUserChange({...user, incomingInvoiceEmail: e.target.value})}
            className="w-full h-9 border-blue-200 focus:border-blue-400"
            placeholder="incoming@example.com"
            readOnly={isReadOnly}
            disabled={isReadOnly}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-blue-500 flex-shrink-0" />
            <Label htmlFor="outgoing-invoice-email" className="text-xs font-medium text-blue-700">Email for Outgoing Invoices</Label>
          </div>
          <Input 
            id="outgoing-invoice-email"
            value={user.outgoingInvoiceEmail || ''}
            onChange={(e) => onUserChange({...user, outgoingInvoiceEmail: e.target.value})}
            className="w-full h-9 border-blue-200 focus:border-blue-400"
            placeholder="outgoing@example.com"
            readOnly={isReadOnly}
            disabled={isReadOnly}
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceEmailsSection;
