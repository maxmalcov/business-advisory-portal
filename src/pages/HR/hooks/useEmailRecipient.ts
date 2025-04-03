
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export function useEmailRecipient() {
  const [emailRecipient, setEmailRecipient] = useState('hr@pba.test');
  const [isValidEmail, setIsValidEmail] = useState(true);

  // Validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle email change with validation
  const handleEmailChange = (newEmail: string) => {
    setEmailRecipient(newEmail);
    setIsValidEmail(validateEmail(newEmail));
  };

  // Submit data to HR email
  const submitToHR = () => {
    // Validate email before submission
    if (!validateEmail(emailRecipient)) {
      setIsValidEmail(false);
      toast({
        title: "Invalid email address",
        description: "Please enter a valid email address before submitting.",
        variant: "destructive",
      });
      return false;
    }
    
    // In a real application, this would send data to a backend service
    // For now we'll just simulate the email being sent
    toast({
      title: "Data submitted",
      description: `Work hours data sent to ${emailRecipient}`,
    });
    
    return true;
  };

  return {
    emailRecipient,
    setEmailRecipient: handleEmailChange,
    isValidEmail,
    submitToHR
  };
}
