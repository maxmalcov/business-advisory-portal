
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

// User types
export type UserType = 'admin' | 'client' | 'manager';
export type AccountType = 'freelancer' | 'sl' | 'sa' | 'individual';

// User interface
export interface Profile {
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
  user: Profile | null;
  supabaseUser: SupabaseUser | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: Partial<Profile> & { password: string }) => Promise<void>;
};

// Create auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  supabaseUser: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
});

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Function to transform Supabase user to our User type
  const transformUser = async (supabaseUser: SupabaseUser): Promise<Profile | null> => {
    if (!supabaseUser) return null;
    
    try {
      // Get user profile data
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      if (!profile) return null;
      
      return {
        id: supabaseUser.id,
        email: profile.email,
        name: profile.full_name || '',
        userType: profile.user_type as UserType,
        accountType: profile.account_type as AccountType | undefined,
        companyName: profile.company_name,
        nif: profile.nif,
        address: profile.address,
        postalCode: profile.postal_code,
        city: profile.city,
        province: profile.province,
        country: profile.country,
        phone: profile.phone,
        incomingInvoiceEmail: profile.incoming_invoice_email,
        outgoingInvoiceEmail: profile.outgoing_invoice_email,
        iframeUrls: profile.iframe_urls,
      };
    } catch (error) {
      console.error('Error transforming user:', error);
      return null;
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true);
      
      try {
        // Set up auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            setSession(newSession);
            
            if (newSession?.user) {
              // Use setTimeout to prevent deadlocks with Supabase auth
              setTimeout(async () => {
                const transformedUser = await transformUser(newSession.user);
                setUser(transformedUser);
                setSupabaseUser(newSession.user);
              }, 0);
            } else {
              setUser(null);
              setSupabaseUser(null);
            }
          }
        );
        
        // Then check for existing session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        
        if (currentSession?.user) {
          const transformedUser = await transformUser(currentSession.user);
          setUser(transformedUser);
          setSupabaseUser(currentSession.user);
        }
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error fetching session:', error);
        toast({
          variant: 'destructive',
          title: 'Authentication Error',
          description: 'Failed to retrieve session',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSession();
  }, [toast]);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: 'Login Successful',
        description: 'You have been successfully logged in.',
      });
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error?.message || 'An unknown error occurred',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: error?.message || 'Failed to log out',
      });
    }
  };

  // Register function
  const register = async (userData: Partial<Profile> & { password: string }) => {
    setIsLoading(true);
    try {
      // Register user with Supabase
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
            phone: userData.phone,
          },
          // Disable email confirmation for testing purposes
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
      
      // Auto-confirm user email for testing purposes
      if (data.user) {
        // We show a different message based on whether email confirmation is needed
        toast({
          title: 'Registration Successful',
          description: 'Your account has been created. You can now log in.',
        });
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: error?.message || 'An unknown error occurred',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      supabaseUser, 
      session,
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
