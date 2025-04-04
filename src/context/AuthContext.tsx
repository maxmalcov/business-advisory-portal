
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
        // Instead of returning null, create a basic profile from the auth data
        // This helps in case of RLS policy issues with the profiles table
        return {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: supabaseUser.user_metadata?.name || '',
          userType: (supabaseUser.user_metadata?.userType as UserType) || 'client',
          accountType: supabaseUser.user_metadata?.accountType as AccountType,
          companyName: supabaseUser.user_metadata?.companyName,
          nif: supabaseUser.user_metadata?.nif,
          address: supabaseUser.user_metadata?.address,
          postalCode: supabaseUser.user_metadata?.postalCode,
          city: supabaseUser.user_metadata?.city,
          province: supabaseUser.user_metadata?.province,
          country: supabaseUser.user_metadata?.country,
          phone: supabaseUser.user_metadata?.phone,
        };
      }
      
      if (!profile) {
        console.warn('No profile found for user:', supabaseUser.id);
        // Create basic profile from auth data
        return {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: supabaseUser.user_metadata?.name || '',
          userType: (supabaseUser.user_metadata?.userType as UserType) || 'client',
        };
      }
      
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
      // Create basic profile from auth data as fallback
      return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.name || '',
        userType: (supabaseUser.user_metadata?.userType as UserType) || 'client',
      };
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true);
      
      try {
        // Check for existing session first
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        // Set up auth state listener 
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, newSession) => {
            console.log('Auth state changed:', event, newSession?.user?.id);
            
            if (newSession?.user) {
              // Use setTimeout to prevent deadlocks with Supabase auth
              setTimeout(async () => {
                const transformedUser = await transformUser(newSession.user);
                setSession(newSession);
                setUser(transformedUser);
                setSupabaseUser(newSession.user);
                setIsLoading(false);
              }, 0);
            } else {
              setSession(null);
              setUser(null);
              setSupabaseUser(null);
              setIsLoading(false);
            }
          }
        );
        
        // Handle existing session
        if (currentSession?.user) {
          const transformedUser = await transformUser(currentSession.user);
          setSession(currentSession);
          setUser(transformedUser);
          setSupabaseUser(currentSession.user);
        }
        
        setIsLoading(false);
        
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
      
      // No need to set anything here as the auth state change will handle it
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error?.message || 'An unknown error occurred',
      });
      setIsLoading(false);
      throw error;
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
