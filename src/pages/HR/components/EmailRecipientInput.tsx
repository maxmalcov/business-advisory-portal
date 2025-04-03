
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface EmailRecipientInputProps {
  emailRecipient: string;
  setEmailRecipient: (value: string) => void;
}

const EmailRecipientInput: React.FC<EmailRecipientInputProps> = ({
  emailRecipient,
  setEmailRecipient
}) => {
  return (
    <div className="mb-6">
      <Label htmlFor="hr-email">HR Email Recipient</Label>
      <div className="flex gap-2 mt-1">
        <Input 
          id="hr-email" 
          value={emailRecipient} 
          onChange={(e) => setEmailRecipient(e.target.value)}
          placeholder="Email address for HR submissions"
          className="max-w-md"
        />
      </div>
    </div>
  );
};

export default EmailRecipientInput;
