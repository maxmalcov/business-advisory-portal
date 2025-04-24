
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WorkHourEmployee {
  employeeName: string;
  companyName?: string | null;
  grossSalary: number;
  absenceDays?: number | null;
  medicalLeaveDate?: string | null;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { monthYear, employees } = await req.json();
    const adminEmail = Deno.env.get("ADMIN_EMAIL");

    if (!adminEmail) {
      throw new Error("Admin email not configured");
    }

    // Format month and year for display
    const date = new Date(monthYear);
    const monthYearDisplay = date.toLocaleDateString('en-US', { 
      month: 'long',
      year: 'numeric'
    });

    // Create HTML table for email body
    const tableRows = employees.map((emp: WorkHourEmployee) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${emp.employeeName}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${emp.companyName || '-'}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">€${emp.grossSalary.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${emp.absenceDays || 0}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${emp.medicalLeaveDate ? new Date(emp.medicalLeaveDate).toLocaleDateString() : '-'}</td>
      </tr>
    `).join('');

    const emailHtml = `
      <h2>Monthly Work Hours Report: ${monthYearDisplay}</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            <th style="padding: 12px 8px; border: 1px solid #ddd;">Employee Name</th>
            <th style="padding: 12px 8px; border: 1px solid #ddd;">Company</th>
            <th style="padding: 12px 8px; border: 1px solid #ddd;">Gross Salary</th>
            <th style="padding: 12px 8px; border: 1px solid #ddd;">Absence Days</th>
            <th style="padding: 12px 8px; border: 1px solid #ddd;">Medical Leave</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;

    const emailResponse = await resend.emails.send({
      from: "HR System <notifications@yourcompany.com>",
      to: [adminEmail],
      subject: `Monthly Work Report Submitted: ${monthYearDisplay}`,
      html: emailHtml,
    });

    console.log("Work hours notification email sent:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Error sending work hours notification:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
