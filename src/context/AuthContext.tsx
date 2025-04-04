
import { AuthProvider, useAuth } from './auth';
import type { Profile, UserType, AccountType, AuthContextType } from './auth/types';

// Re-export types
export type { Profile, UserType, AccountType, AuthContextType };

// Re-export components and hooks
export { AuthProvider, useAuth };
