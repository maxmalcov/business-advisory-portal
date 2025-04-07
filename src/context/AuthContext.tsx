
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
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<AppUser> & { password: string }) => Promise<void>;
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

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [profileCreationAttempts, setProfileCreationAttempts] = useState(0);

  // Check for existing auth on mount and set up auth state listener
  useEffect(() => {
    console.log("Setting up authentication state handling");
    
    // First set up auth state listener to catch all events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id);
        
        if (currentSession) {
          setSession(currentSession);
          
          if (currentSession.user) {
            console.log("User authenticated in state change, fetching profile");
            // Use setTimeout to avoid potential Supabase authentication deadlock
            setTimeout(() => {
              fetchUserProfile(currentSession.user.id);
            }, 100);
          }
        } else {
          setUser(null);
          setSession(null);
          setIsLoading(false);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession?.user?.id);
      
      if (currentSession) {
        setSession(currentSession);
        
        if (currentSession.user) {
          console.log("User authenticated in initial check, fetching profile");
          // Use setTimeout to avoid potential deadlocks
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id);
          }, 100);
        } else {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }).catch((error) => {
      console.error('Error retrieving session:', error);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Enhanced fetch user profile function with retry mechanism
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching user profile with ID:", userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // Handle case when profile doesn't exist yet
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating a default profile');
          await createNewProfile(userId);
        } else {
          console.error('Error fetching profile:', error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to load user profile: ' + error.message,
          });
          setIsLoading(false);
        }
      } else if (data) {
        console.log("Profile data fetched successfully:", data);
        // Map database column names (lowercase) to our app's interface (camelCase)
        setUser({
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
          iframeUrls: [] // You might want to add this to your database schema
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load user profile',
      });
      setIsLoading(false);
    }
  };

  // New function to create a profile with better error handling
  const createNewProfile = async (userId: string) => {
    try {
      console.log("Creating new profile for user:", userId);
      setProfileCreationAttempts(prev => prev + 1);
      
      // Get the user's email directly from the session to ensure we have it
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User data not available");
      }
      
      console.log("Retrieved user data for profile creation:", user.email);
      
      // Create a basic profile
      const newProfile = {
        id: userId,
        email: user.email || '',
        name: user.email?.split('@')[0] || 'New User',
        usertype: 'client' // Match the column name in the database (lowercase)
      };
      
      console.log("Attempting to create profile with data:", newProfile);
      
      // First try direct insert
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([newProfile]);
      
      if (insertError) {
        console.log('Insert attempt failed, trying upsert:', insertError);
        
        // If insert fails, try upsert
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert([newProfile]);
        
        if (upsertError) {
          console.error('Profile creation failed with upsert:', upsertError);
          throw upsertError;
        }
      }
      
      console.log('Profile created successfully, now fetching it');
      
      // Wait a moment to ensure the profile is available
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Try to fetch the newly created profile
      const { data: profileData, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (fetchError) {
        console.error('Error fetching newly created profile:', fetchError);
        throw fetchError;
      }
      
      if (profileData) {
        console.log('Successfully fetched newly created profile:', profileData);
        setUser({
          id: profileData.id,
          email: profileData.email || '',
          name: profileData.name || '',
          userType: (profileData.usertype as UserType) || 'client',
          accountType: profileData.accounttype as AccountType,
          companyName: profileData.companyname,
          nif: profileData.nif,
          address: profileData.address,
          postalCode: profileData.postalcode,
          city: profileData.city,
          province: profileData.province,
          country: profileData.country,
          phone: profileData.phone,
          incomingInvoiceEmail: profileData.incominginvoiceemail,
          outgoingInvoiceEmail: profileData.outgoinginvoiceemail,
          iframeUrls: []
        });
        
        toast({
          title: 'Profile Created',
          description: 'Your user profile has been created successfully.',
        });
      } else {
        throw new Error("Profile created but data is null");
      }
    } catch (error: any) {
      console.error('Error in profile creation process:', error);
      
      // Retry logic with backoff
      if (profileCreationAttempts < 3) {
        console.log(`Retrying profile creation (attempt ${profileCreationAttempts + 1}/3)`);
        setTimeout(() => {
          createNewProfile(userId);
        }, 1000 * (profileCreationAttempts + 1)); // Increasing delay for each retry
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to create user profile: ' + (error.message || 'Unknown error'),
        });
        // Set isLoading to false to ensure UI is responsive even if profile creation fails
        setIsLoading(false);
      }
    } finally {
      // We'll set isLoading to false in the fetchUserProfile function when it completes
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("Attempting login for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }

      console.log("Login successful, session:", data.session?.user.id);
      
      // We don't need to manually fetch profile here as the auth state listener will do it
      
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
      setIsLoading(false);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
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
      // Map our application property names (camelCase) to database column names (lowercase)
      const userMetadata = {
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
      };
      
      // Register the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: userData.email || '',
        password: userData.password,
        options: {
          data: userMetadata
        }
      });
      
      if (error) {
        throw error;
      }
      
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
      setIsLoading(false);
      throw error;
    }
  };

  // Debug output
  useEffect(() => {
    console.log("Auth state updated:", {
      isAuthenticated: !!session,
      isLoading,
      user: user?.name
    });
  }, [session, isLoading, user]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isAuthenticated: !!session,
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
