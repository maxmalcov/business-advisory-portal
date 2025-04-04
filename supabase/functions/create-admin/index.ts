
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the admin key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // Check if an admin already exists
    const { data: existingAdmins, error: checkError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('user_type', 'admin')
      .limit(1);

    if (checkError) {
      throw new Error(`Error checking for existing admins: ${checkError.message}`);
    }

    // If admin already exists, return info
    if (existingAdmins && existingAdmins.length > 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Admin user already exists",
          adminExists: true 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create admin user
    const adminEmail = "admin@businessadvisory.com";
    const adminPassword = "admin123";
    
    // Create user in auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        name: "Admin User",
        userType: "admin"
      }
    });

    if (authError || !authData.user) {
      throw new Error(`Error creating admin user: ${authError?.message || "Unknown error"}`);
    }

    // Update the profile to ensure user_type is set to admin
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ user_type: 'admin' })
      .eq('id', authData.user.id);

    if (updateError) {
      throw new Error(`Error updating admin profile: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Admin user created successfully",
        email: adminEmail,
        password: adminPassword
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
