
import { useState, useEffect } from 'react';

export const useEmailRecipient = () => {
  const [emailRecipient, setEmailRecipient] = useState<string>('');
  const [isValidEmail, setIsValidEmail] = useState<boolean>(false);

  useEffect(() => {
    // Email validation regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setIsValidEmail(emailRegex.test(emailRecipient));
  }, [emailRecipient]);

  const submitToHR = async () => {
    if (!isValidEmail) {
      return false;
    }
    
    // This is a placeholder for future email sending functionality
    console.log(`Would send email to HR at: ${emailRecipient}`);
    return true;
  };

  return {
    emailRecipient,
    setEmailRecipient,
    isValidEmail,
    submitToHR
  };
};
