
import React from 'react';
import type { User } from '../../hooks/types';

interface ContactInfoSectionProps {
  user: User;
  onUserChange: (user: User) => void;
  isReadOnly?: boolean;
}

const ContactInfoSection: React.FC<ContactInfoSectionProps> = () => {
  // This component is now empty as its functionality has been moved to InvoiceEmailsSection
  return null;
};

export default ContactInfoSection;
