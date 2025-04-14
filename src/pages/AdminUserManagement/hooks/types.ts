
// Basic user types
export type UserType = 'admin' | 'client' | 'manager';
export type AccountType = 'freelancer' | 'sl' | 'sa' | 'individual';

// Main user interface for admin management
export interface User {
  id: string;
  name: string;
  email: string;
  companyName?: string;
  userType: UserType;
  isActive: boolean;
  accountType?: AccountType;
  phone?: string;
  nif?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  province?: string;
  country?: string;
  incomingInvoiceEmail?: string;
  outgoingInvoiceEmail?: string;
  iframeUrls?: string[];
}

// Activity data for user
export interface UserActivity {
  id: string;
  type: string;
  description: string;
  date: string;
  status?: string;
}
