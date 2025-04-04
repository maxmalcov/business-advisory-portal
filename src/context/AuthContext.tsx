
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

// User types
export type UserType = 'admin' | 'client' | 'manager';
export type AccountType = 'freelancer' | 'sl' | 'sa' | 'individual';

// User interface
export interface AppUser {
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
  user: AppUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: Partial<AppUser> & { password: string }) => Promise<void>;
};

// Create auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
});

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    try {
      // Use a more direct approach to query the database
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        // Map the database fields to our AppUser interface
        return {
          id: data.id,
          email: data.email,
          name: data.name || '',
          userType: data.user_type as UserType,
          accountType: data.account_type as AccountType,
          companyName: data.company_name,
          nif: data.nif,
          address: data.address,
          postalCode: data.postal_code,
          city: data.city,
          province: data.province,
          country: data.country,
          phone: data.phone,
          incomingInvoiceEmail: data.incoming_invoice_email,
          outgoingInvoiceEmail: data.outgoing_invoice_email,
          iframeUrls: [] // To be filled in later if needed
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Set up auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setIsLoading(true);
        
        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user.id);
          setUser(userProfile);
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Initial session check
    const initAuth = async () => {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const userProfile = await fetchUserProfile(session.user.id);
        setUser(userProfile);
      }
      
      setIsLoading(false);
    };

    initAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        const userProfile = await fetchUserProfile(data.user.id);
        
        toast({
          title: 'Login Successful',
          description: `Welcome back, ${userProfile?.name || 'User'}!`,
        });
        
        // Redirect based on user type
        if (userProfile?.userType === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'Invalid credentials',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      navigate('/login');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: error.message || 'An unknown error occurred',
      });
    }
  };

  // Register function
  const register = async (userData: Partial<AppUser> & { password: string }) => {
    setIsLoading(true);
    try {
      // Register user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: userData.email || '',
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            userType: userData.userType || 'client',
            accountType: userData.accountType,
            companyName: userData.companyName,
            nif: userData.nif,
            address: userData.address,
            postalCode: userData.postalCode,
            city: userData.city,
            province: userData.province,
            country: userData.country,
            phone: userData.phone
          }
        }
      });

      if (error) throw error;

      toast({
        title: 'Registration Successful',
        description: 'Your account has been created successfully.',
      });
      
      // Navigate to dashboard after successful registration
      if (data.user && data.session) {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: error.message || 'An unknown error occurred',
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
