
import { User } from '@supabase/supabase-js';
import { Profile, AccountType } from './types';
import { supabase } from '@/integrations/supabase/client';

export const transformUser = async (supabaseUser: User): Promise<Profile> => {
  try {
    // Try to fetch the user profile from the profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      // If there's an error, return a minimal profile
      return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.name || '',
        userType: supabaseUser.user_metadata?.userType || 'client',
      };
    }

    // Validate account_type is a valid AccountType
    const validateAccountType = (type: string | null): AccountType | undefined => {
      if (!type) return undefined;
      
      const validTypes: AccountType[] = ['freelancer', 'sl', 'sa', 'individual'];
      return validTypes.includes(type as AccountType) 
        ? (type as AccountType) 
        : undefined;
    };

    // Transform the database profile to match our application's Profile type
    return {
      id: profile.id,
      email: profile.email || supabaseUser.email || '',
      name: profile.full_name || supabaseUser.user_metadata?.name || '',
      userType: profile.user_type || supabaseUser.user_metadata?.userType || 'client',
      accountType: validateAccountType(profile.account_type),
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
    console.error('Unexpected error transforming user:', error);
    // Fallback to minimal profile if anything goes wrong
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.name || '',
      userType: supabaseUser.user_metadata?.userType || 'client',
    };
  }
};
