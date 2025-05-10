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
  adminName?: string;
  password?: string; // For new user creation only
}

// Activity data for user
export interface UserActivity {
  id: string;
  type: string;
  description: string;
  date: string;
  status?: string;
}

// Iframe subscription types
export interface IframeSubscription {
  id: string;
  name: string;
  url: string;
  status: 'active' | 'inactive';
  startDate: Date;
  endDate?: Date; // Optional end date for unlimited subscriptions
  isLifetime: boolean;
}

export interface SubscriptionHistoryEntry {
  id: string;
  subscriptionId: string;
  date: Date;
  action: 'activated' | 'deactivated' | 'period_updated';
  adminName?: string;
  periodChanges?: {
    oldStartDate?: Date;
    newStartDate?: Date;
    oldEndDate?: Date;
    newEndDate?: Date;
    oldIsLifetime?: boolean;
    newIsLifetime?: boolean;
  };
}

export type DateFilterOption = '7days' | '30days' | 'custom' | 'all';

// Updated DateRange to make 'to' optional to match react-day-picker's DateRange type
export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}
