
import { supabase } from '@/integrations/supabase/client';

// This function will register demo users if they don't exist
export const registerDemoUsers = async () => {
  try {
    // First check if admin exists
    const { data: adminExists, error: adminCheckError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', 'admin@example.com')
      .maybeSingle();
      
    if (adminCheckError) {
      console.error('Error checking for admin user:', adminCheckError);
    }
    
    // If admin doesn't exist, create it
    if (!adminExists) {
      // Using signUp to create the admin user
      const { error: adminCreateError } = await supabase.auth.signUp({
        email: 'admin@example.com',
        password: 'password123',
        options: {
          data: {
            name: 'Admin User',
            userType: 'admin',
          },
        }
      });
      
      if (adminCreateError) {
        console.error('Error creating admin user:', adminCreateError);
      } else {
        console.log('Admin demo user created successfully');
      }
    }
    
    // Check if client exists
    const { data: clientExists, error: clientCheckError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', 'client@example.com')
      .maybeSingle();
      
    if (clientCheckError) {
      console.error('Error checking for client user:', clientCheckError);
    }
    
    // If client doesn't exist, create it
    if (!clientExists) {
      // Using signUp to create the client user
      const { error: clientCreateError } = await supabase.auth.signUp({
        email: 'client@example.com',
        password: 'password123',
        options: {
          data: {
            name: 'Client User',
            userType: 'client',
          },
        }
      });
      
      if (clientCreateError) {
        console.error('Error creating client user:', clientCreateError);
      } else {
        console.log('Client demo user created successfully');
      }
    }
  } catch (error) {
    console.error('Error registering demo users:', error);
  }
};
