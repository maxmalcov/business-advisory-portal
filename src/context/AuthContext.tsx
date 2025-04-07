
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

// User types
export type UserType = 'admin' | 'client' | 'manager';
export type AccountType = 'freelancer' | 'sl' | 'sa' | 'individual';

// User interface for our application
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
  session: Session | null; // Added session to the context
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<AppUser> & { password: string }) => Promise<void>;
  refreshUserProfile: () => Promise<void>; // Added function to manually refresh profile
};

// Create auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null, // Added session to default values
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  refreshUserProfile: async () => {}, // Added to default values
});

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch user profile from the database with retry mechanism
  const fetchUserProfile = async (userId: string, retryCount = 3) => {
    try {
      console.log("Fetching user profile for ID:", userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // Handle case when profile doesn't exist yet
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating a default profile');
          // Get the user's email from auth
          const { data: userData } = await supabase.auth.getUser();
          
          if (userData && userData.user) {
            // Create a basic profile
            const newProfile = {
              id: userId,
              email: userData.user.email || '',
              name: userData.user.email?.split('@')[0] || 'New User',
              userType: 'client' as UserType
            };
            
            // Insert the profile
            const { error: insertError } = await supabase
              .from('profiles')
              .insert([newProfile]);
              
            if (insertError) {
              throw insertError;
            }
            
            // Set the user state with the new profile
            setUser(newProfile);
            toast({
              title: 'Profile Created',
              description: 'Your user profile has been created successfully.',
            });
            return;
          }
        }
        
        // Network errors might require retries
        if (retryCount > 0 && (error.message.includes('Failed to fetch') || error.code === 'NETWORK_ERROR')) {
          console.log(`Retrying profile fetch. Attempts remaining: ${retryCount-1}`);
          // Wait briefly before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
          return fetchUserProfile(userId, retryCount - 1);
        }
        
        throw error;
      }

      if (data) {
        const appUser: AppUser = {
          id: data.id,
          email: data.email || '',
          name: data.name || '',
          userType: (data.usertype as UserType) || 'client',
          accountType: data.accounttype as AccountType,
          companyName: data.companyname,
          nif: data.nif,
          address: data.address,
          postalCode: data.postalcode,
          city: data.city,
          province: data.province,
          country: data.country,
          phone: data.phone,
          incomingInvoiceEmail: data.incominginvoiceemail,
          outgoingInvoiceEmail: data.outgoinginvoiceemail,
          iframeUrls: []
        };
        
        setUser(appUser);
        console.log("User profile loaded successfully:", appUser);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load user profile. Please try refreshing the page.',
      });
    }
  };
  
  // Function to refresh user profile manually
  const refreshUserProfile = async () => {
    if (session?.user?.id) {
      await fetchUserProfile(session.user.id);
    }
  };

  // Check for existing auth on mount and set up auth state listener
  useEffect(() => {
    let mounted = true;
    console.log("Setting up auth state listeners");
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        if (!mounted) return;
        
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Use setTimeout to avoid potential Supabase authentication deadlock
          setTimeout(() => {
            if (mounted) {
              fetchUserProfile(currentSession.user.id);
            }
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!mounted) return;
      
      console.log("Got initial session:", currentSession ? "Session exists" : "No session");
      setSession(currentSession);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id);
      }
      setIsLoading(false);
    }).catch((error) => {
      console.error('Error retrieving session:', error);
      if (mounted) {
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
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
      
      if (error) {
        throw error;
      }

      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
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
      await supabase.auth.signOut();
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: 'Failed to log out. Please try again.',
      });
    }
  };

  // Register function
  const register = async (userData: Partial<AppUser> & { password: string }) => {
    setIsLoading(true);
    try {
      // Register the user with Supabase Auth
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
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Wait a moment to ensure the profile is created via trigger
      setTimeout(() => {
        refreshUserProfile();
      }, 1000);
      
      toast({
        title: 'Registration Successful',
        description: 'Your account has been created successfully.',
      });
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
      session, // Added session to the context
      isLoading, 
      isAuthenticated: !!session,
      login,
      logout,
      register,
      refreshUserProfile // Added to the context
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext);
