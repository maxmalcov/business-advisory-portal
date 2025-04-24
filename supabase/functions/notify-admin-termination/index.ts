
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TerminationNotificationData {
  employeeName: string;
  terminationDate: string;
  terminationReason: string;
  additionalVacationDays: string;
  comments?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: TerminationNotificationData = await req.json();
    const adminEmail = Deno.env.get("ADMIN_EMAIL");

    if (!adminEmail) {
      throw new Error("Admin email not configured");
    }

    // Construct email body
    const emailBody = `
A termination request has been submitted by a client.

👤 Employee Name: ${data.employeeName}
📅 Termination Date: ${data.terminationDate}
❌ Reason for Termination: ${data.terminationReason}
🏖️ Vacation Days to Compensate: ${data.additionalVacationDays}

${data.comments ? `📝 Additional Comments: ${data.comments}` : ''}
`;

    const emailResponse = await resend.emails.send({
      from: "HR System <notifications@yourcompany.com>",
      to: [adminEmail],
      subject: `Employee Termination Notice: ${data.employeeName}`,
      text: emailBody,
    });

    console.log("Termination notification email sent:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Error sending termination notification:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
