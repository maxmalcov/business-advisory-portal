
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Setup Resend with API Key
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Set up CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Interface for the email request payload
interface InvoiceEmailRequest {
  recipientEmail: string;
  fileNames: string[];
  userName: string;
  invoiceType: 'incoming' | 'outgoing';
  message?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const { recipientEmail, fileNames, userName, invoiceType, message }: InvoiceEmailRequest = await req.json();

    if (!recipientEmail || !fileNames || !fileNames.length) {
      throw new Error("Missing required email parameters");
    }

    // Create HTML email content with file list
    const fileListHtml = fileNames.map(filename => `<li>${filename}</li>`).join('');
    
    // Determine appropriate email subject based on invoice type
    const invoiceTypeLabel = invoiceType === 'incoming' ? 'Incoming' : 'Outgoing';
    
    // Send the email
    const emailResponse = await resend.emails.send({
      from: "Invoice System <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: `New ${invoiceTypeLabel} Invoice(s) Uploaded`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">${invoiceTypeLabel} Invoice Notification</h1>
          <p>Hello ${userName},</p>
          <p>The following ${invoiceTypeLabel.toLowerCase()} invoice files have been uploaded to your account:</p>
          <ul style="margin-bottom: 20px;">
            ${fileListHtml}
          </ul>
          ${message ? `<p>${message}</p>` : ''}
          <p>These invoices have been processed and are now available in your account dashboard.</p>
          <p>Best regards,<br>Invoice Management System</p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending invoice email:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
