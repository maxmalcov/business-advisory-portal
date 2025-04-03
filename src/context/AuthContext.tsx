
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

// User types
export type UserType = 'admin' | 'client';
export type AccountType = 'freelancer' | 'sl' | 'sa' | 'individual';

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  userType: UserType;
  accountType?: AccountType;
  companyName?: string;
  nif?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  province?: string;
  country?: string;
  phone?: string;
  incomingInvoiceEmail?: string;
  outgoingInvoiceEmail?: string;
  iframeUrls?: string[];
}

// Auth context type
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
};

// Create auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

// Mock users for demo (would be replaced by actual API calls in production)
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: '1',
    email: 'admin@businessadvisory.com',
    password: 'admin123',
    name: 'Admin User',
    userType: 'admin',
    phone: '+34612345678',
  },
  {
    id: '2',
    email: 'client@example.com',
    password: 'client123',
    name: 'Example Client',
    userType: 'client',
    accountType: 'sl',
    companyName: 'Example SL',
    nif: 'B12345678',
    address: 'Calle Example 123',
    postalCode: '28001',
    city: 'Madrid',
    province: 'Madrid',
    country: 'Spain',
    phone: '+34698765432',
    incomingInvoiceEmail: 'invoices-in@example.com',
    outgoingInvoiceEmail: 'invoices-out@example.com',
  }
];

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check for existing auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = MOCK_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        toast({
          title: 'Login Successful',
          description: `Welcome back, ${userWithoutPassword.name}!`,
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
  };

  // Register function
  const register = async (userData: Partial<User> & { password: string }) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      const emailExists = MOCK_USERS.some(u => u.email.toLowerCase() === userData.email?.toLowerCase());
      if (emailExists) {
        throw new Error('Email already in use');
      }
      
      // Create new user (in a real app, this would be an API call)
      const newUser: User = {
        id: `${MOCK_USERS.length + 1}`,
        email: userData.email || '',
        name: userData.name || '',
        userType: 'client', // Default to client for new registrations
        accountType: userData.accountType as AccountType,
        companyName: userData.companyName,
        nif: userData.nif,
        address: userData.address,
        postalCode: userData.postalCode,
        city: userData.city,
        province: userData.province,
        country: userData.country,
        phone: userData.phone,
      };
      
      // In a real app, we would save this user to the database
      // For now, we'll just update our local state
      MOCK_USERS.push({ ...newUser, password: userData.password });
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      toast({
        title: 'Registration Successful',
        description: 'Your account has been created successfully.',
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isAuthenticated: !!user,
      login,
      logout,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext);
