
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from './types';

// Function to transform Supabase user to our User type
export const transformUser = async (supabaseUser: SupabaseUser): Promise<Profile | null> => {
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
        userType: (supabaseUser.user_metadata?.userType as any) || 'client',
        accountType: supabaseUser.user_metadata?.accountType,
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
        userType: (supabaseUser.user_metadata?.userType as any) || 'client',
      };
    }
    
    return {
      id: supabaseUser.id,
      email: profile.email,
      name: profile.full_name || '',
      userType: profile.user_type as any,
      accountType: profile.account_type as any,
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
      userType: (supabaseUser.user_metadata?.userType as any) || 'client',
    };
  }
};
