
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';

interface EmailRecipientInputProps {
  emailRecipient: string;
  setEmailRecipient: (value: string) => void;
  isValidEmail?: boolean;
}

const EmailRecipientInput: React.FC<EmailRecipientInputProps> = ({
  emailRecipient,
  setEmailRecipient,
  isValidEmail = true
}) => {
  return (
    <div className="mb-6">
      <Label htmlFor="hr-email" className="flex items-center gap-1">
        HR Email Recipient
        {!isValidEmail && (
          <span className="text-destructive text-xs font-normal flex items-center">
            <AlertCircle size={12} className="mr-1" /> Invalid email format
          </span>
        )}
      </Label>
      <div className="flex gap-2 mt-1">
        <Input 
          id="hr-email" 
          value={emailRecipient} 
          onChange={(e) => setEmailRecipient(e.target.value)}
          placeholder="Email address for HR submissions"
          className={`max-w-md ${!isValidEmail ? 'border-destructive' : ''}`}
          type="email"
        />
      </div>
    </div>
  );
};

export default EmailRecipientInput;
