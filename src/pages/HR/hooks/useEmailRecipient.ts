
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export function useEmailRecipient() {
  const [emailRecipient, setEmailRecipient] = useState('hr@pba.test');

  // Submit data to HR email
  const submitToHR = () => {
    // In a real application, this would send data to a backend service
    // For now we'll just simulate the email being sent
    toast({
      title: "Data submitted",
      description: `Work hours data sent to ${emailRecipient}`,
    });
  };

  return {
    emailRecipient,
    setEmailRecipient,
    submitToHR
  };
}
