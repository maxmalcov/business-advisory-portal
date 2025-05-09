import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
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
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    userData: Partial<AppUser> & { password: string },
  ) => Promise<void>;
};

// Create auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check for existing auth on mount and set up auth state listener
  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log('Auth state changed:', event, currentSession?.user?.id);
      setSession(currentSession);

      if (currentSession?.user) {
        // Use setTimeout to avoid potential Supabase authentication deadlock
        setTimeout(() => {
          fetchUserProfile(currentSession.user.id);
        }, 0);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    // Check for existing session
    supabase.auth
      .getSession()
      .then(({ data: { session: currentSession } }) => {
        console.log('Initial session check:', currentSession?.user?.id);
        setSession(currentSession);

        if (currentSession?.user) {
          fetchUserProfile(currentSession.user.id);
        } else {
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error retrieving session:', error);
        setIsLoading(false);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile from the database with improved error handling and retries
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile with ID:', userId);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);

        // Only create a new profile if the error is that the profile doesn't exist
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating a default profile');
          await createUserProfile(userId);
        } else {
          throw error;
        }
      } else if (data) {
        console.log('Profile data fetched:', data);
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
          iframeUrls: data.iframeurls, // Include iframeUrls from the profile
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load user profile',
      });
      setIsLoading(false);
    }
  };

  // Create user profile if it doesn't exist
  const createUserProfile = async (userId: string) => {
    try {
      console.log('Creating profile for user:', userId);

      // Get the user's email from auth
      const { data: userData } = await supabase.auth.getUser();

      if (!userData || !userData.user) {
        throw new Error('No user data available');
      }

      // Create a basic profile
      const newProfile = {
        id: userId,
        email: userData.user.email || '',
        name: userData.user.email?.split('@')[0] || 'New User',
        usertype: 'client', // Match the column name in the database (lowercase)
        iframeurls: [], // Initialize with empty array
      };

      // Insert the profile
      const { error: insertError, data } = await supabase
        .from('profiles')
        .upsert([newProfile], { onConflict: 'id' });

      if (insertError) {
        console.error('Error creating profile:', insertError);
        throw insertError;
      }

      console.log('Profile created successfully:', data);

      // Set the user state with the new profile
      setUser({
        id: newProfile.id,
        email: newProfile.email,
        name: newProfile.name,
        userType: newProfile.usertype as UserType,
        iframeUrls: [],
      });

      toast({
        title: 'Profile Created',
        description: 'Your user profile has been created successfully.',
      });
    } catch (error) {
      console.error('Error in createUserProfile:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create user profile',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Login function with improved error handling
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('Attempting login for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
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
  const register = async (
    userData: Partial<AppUser> & { password: string },
  ) => {
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
      console.log(userData)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email || '',
        password: userData.password,
        options: {
          data: userMetadata,
        },
      });
      if(authError){
        throw new Error()
      }
      const {data, error} = await supabase.from('profiles').update({
        name: userData.name || '',
        usertype: userData.userType || 'client',
        companyname: userData.companyName || '-',
        accounttype: userData.accountType || 'freelancer',
        nif: userData.nif || '',
        address: userData.address || '',
        postalcode: userData.postalCode || '',
        city: userData.city || '',
        province: userData.province || '',
        country: userData.country || '',
        phone: userData.phone || '',
        incominginvoiceemail: userData.incomingInvoiceEmail || '',
        outgoinginvoiceemail: userData.outgoingInvoiceEmail || '',
      }).eq('id', authData.user.id)

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

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated: !!session,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext);
