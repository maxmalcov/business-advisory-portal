
import React, { useState, useEffect, ReactNode } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AuthContext from './AuthContext';
import { Profile } from './types';
import { transformUser } from './utils';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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

export default AuthProvider;
