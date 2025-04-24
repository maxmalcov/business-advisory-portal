
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "npm:@supabase/supabase-js@2.39.0";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Setup Supabase and Resend clients
const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
const supabase = createClient(supabaseUrl, supabaseServiceKey);
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Interface for employee registration data
interface EmployeeRegistrationData {
  fullName: string;
  companyName: string;
  employeeDni: string;
  startDate: string;
  schedule: string;
  position: string;
  socialSecurityNumber: string;
  salary: string;
  salaryType: string;
  iban: string;
  employeeEmail: string;
  address: string;
  comments?: string;
  idDocument: string | null;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const employeeData: EmployeeRegistrationData = await req.json();
    const adminEmail = Deno.env.get("ADMIN_EMAIL") || "admin@example.com";

    // Construct email body in a readable text format
    const emailBody = `
A new employee has been registered by a client.

👤 Full Name: ${employeeData.fullName}
🏢 Company Name: ${employeeData.companyName}
🆔 Employee DNI/TIE: ${employeeData.employeeDni}
📅 Start Date: ${employeeData.startDate}
🕒 Working Schedule: ${employeeData.schedule}
💼 Job Position: ${employeeData.position}
🔐 Social Security Number: ${employeeData.socialSecurityNumber}

💰 Monthly Salary: ${employeeData.salary} (${employeeData.salaryType})
🏦 IBAN: ${employeeData.iban}
📧 Employee Email: ${employeeData.employeeEmail}
🏠 Address: ${employeeData.address}
📝 Additional Comments: ${employeeData.comments || 'None'}
`;

    // Prepare attachments if ID document exists
    const attachments = [];
    if (employeeData.idDocument) {
      try {
        // Fetch the document from Supabase Storage
        const { data, error } = await supabase.storage
          .from('employee_documents')
          .createSignedUrl(employeeData.idDocument, 60);

        if (data && !error) {
          // Download the file
          const fileResponse = await fetch(data.signedUrl);
          const fileBlob = await fileResponse.arrayBuffer();
          const base64File = btoa(String.fromCharCode.apply(null, new Uint8Array(fileBlob)));

          attachments.push({
            filename: `id_document_${employeeData.fullName}.pdf`,
            content: base64File,
            encoding: 'base64'
          });
        }
      } catch (storageError) {
        console.error("Error processing ID document:", storageError);
      }
    }

    // Send email to admin
    const emailResponse = await resend.emails.send({
      from: "HR System <notifications@yourcompany.com>",
      to: [adminEmail],
      subject: `New Employee Registered: ${employeeData.fullName}`,
      text: emailBody,
      attachments: attachments
    });

    // Log the email sending
    await supabase
      .from('invoice_email_logs')
      .insert({
        user_id: null, // No specific user ID for this system email
        invoice_type: 'system',
        recipient_email: adminEmail,
        file_ids: employeeData.idDocument ? [employeeData.idDocument] : []
      });

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error) {
    console.error("Error in new employee notification:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
