
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Admin key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check if admin already exists
    const { data: existingAdmins, error: queryError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_type', 'admin')
      .limit(1)

    if (queryError) {
      throw queryError
    }

    if (existingAdmins && existingAdmins.length > 0) {
      return new Response(
        JSON.stringify({ success: false, adminExists: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // If no admin exists, create one
    const email = 'admin@businessadvisory.com'
    const password = 'admin123'

    // Create user with admin role
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name: 'System Administrator',
        userType: 'admin'
      }
    })

    if (authError) {
      throw authError
    }

    // Ensure the profile is properly created with admin user_type
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ user_type: 'admin' })
        .eq('id', authData.user.id)

      if (profileError) {
        console.error('Error updating profile:', profileError)
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        email,
        password
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error creating admin:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false,
        message: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})
