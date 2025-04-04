
import { supabase } from '@/integrations/supabase/client';

// This function will register demo users if they don't exist
export const registerDemoUsers = async () => {
  try {
    // Check if any admin exists in the system
    const { data: adminExists, error: adminCheckError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_type', 'admin')
      .maybeSingle();
      
    if (adminCheckError) {
      console.error('Error checking for admin user:', adminCheckError);
    }
    
    // Only create an admin if none exists in the system
    if (!adminExists) {
      console.log('No admin found in the system, creating the default admin account');
      
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
        console.log('Admin user created successfully');
      }
    } else {
      console.log('Admin user already exists in the system');
    }
    
    // Check if client demo exists
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
