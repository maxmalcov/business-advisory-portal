
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "npm:@supabase/supabase-js@2.39.0";

// Setup Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
const supabase = createClient(supabaseUrl, supabaseKey);

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
  fileIds: string[];
  fileNames: string[];
  userName: string;
  companyName?: string;
  invoiceType: 'incoming' | 'outgoing';
  message?: string;
  userId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const { 
      recipientEmail, 
      fileIds, 
      fileNames, 
      userName, 
      companyName, 
      invoiceType, 
      message,
      userId
    }: InvoiceEmailRequest = await req.json();

    if (!recipientEmail || !fileNames || !fileNames.length || !userId) {
      throw new Error("Missing required email parameters");
    }

    console.log(`Processing email request for ${invoiceType} invoice with ${fileIds.length} files`);

    // Fetch file content from Supabase Storage
    const attachments = [];
    const bucketName = 'invoices';
    
    for (let i = 0; i < fileIds.length; i++) {
      const fileId = fileIds[i];
      const fileName = fileNames[i];
      
      console.log(`Fetching file: ${fileId}`);
      
      try {
        // Get file metadata from the database
        const { data: fileData, error: fileError } = await supabase
          .from('invoice_files')
          .select('storage_path')
          .eq('id', fileId)
          .single();
        
        if (fileError || !fileData) {
          console.error(`Error retrieving file metadata: ${fileError?.message}`);
          continue;
        }

        console.log(`Retrieved file path: ${fileData.storage_path}`);
        
        // Download the file from storage
        const { data, error } = await supabase
          .storage
          .from(bucketName)
          .download(fileData.storage_path);
          
        if (error || !data) {
          console.error(`Error downloading file: ${error?.message}`);
          continue;
        }
        
        console.log(`Successfully downloaded file: ${fileName} (${data.size} bytes)`);
        
        // Convert blob to base64 for email attachment - using a safer approach
        // to avoid Maximum call stack size exceeded error
        const buffer = await data.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = '';
        const chunkSize = 1024; // Process in smaller chunks to avoid stack issues
        
        for (let j = 0; j < bytes.length; j += chunkSize) {
          const chunk = bytes.slice(j, Math.min(j + chunkSize, bytes.length));
          binary += String.fromCharCode.apply(null, [...chunk]);
        }
        
        const base64 = btoa(binary);
        
        attachments.push({
          filename: fileName,
          content: base64,
          encoding: 'base64',
          type: getContentType(fileName),
        });
        
        console.log(`File ${fileName} prepared for email attachment, base64 length: ${base64.length}`);
      } catch (error) {
        console.error(`Error processing file ${fileId}: ${error}`);
      }
    }

    // Create HTML email content with file list
    const fileListHtml = fileNames.map(filename => `<li>${filename}</li>`).join('');
    
    // Determine appropriate email subject based on invoice type
    const invoiceTypeLabel = invoiceType === 'incoming' ? 'Supplier' : 'Sales';
    const senderName = companyName || userName;
    
    console.log(`About to send email with ${attachments.length} attachments of sizes: ${attachments.map(a => a.content.length).join(', ')} characters`);
    
    if (attachments.length === 0) {
      throw new Error("No valid attachments were prepared for the email");
    }
    
    // Send the email with attachments
    const emailResponse = await resend.emails.send({
      from: "Invoice System <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: `New ${invoiceTypeLabel} Invoice${fileNames.length > 1 ? 's' : ''} from ${senderName}`,
      attachments: attachments,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">${invoiceTypeLabel} Invoice Notification</h1>
          <p>Hello,</p>
          <p>The following ${invoiceTypeLabel.toLowerCase()} invoice file${fileNames.length > 1 ? 's have' : ' has'} been uploaded by ${senderName}:</p>
          <ul style="margin-bottom: 20px;">
            ${fileListHtml}
          </ul>
          ${message ? `<p>Message: ${message}</p>` : ''}
          <p>Please find the invoice${fileNames.length > 1 ? 's' : ''} attached to this email.</p>
          <p>Best regards,<br>Invoice Management System</p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    // Log the email sending in the database
    try {
      const { error: logError } = await supabase
        .from('invoice_email_logs')
        .insert({
          user_id: userId,
          invoice_type: invoiceType === 'incoming' ? 'supplier' : 'sale',
          recipient_email: recipientEmail,
          file_ids: fileIds
        });
        
      if (logError) {
        console.error("Error logging email:", logError);
      }
    } catch (logErr) {
      console.error("Failed to log email sending:", logErr);
    }

    // Log to the invoice_uploads table for each file
    try {
      const fileUploads = fileIds.map(async (fileId, index) => {
        // Get the file data from invoice_files
        const { data: fileData, error: fileDataError } = await supabase
          .from('invoice_files')
          .select('*')
          .eq('id', fileId)
          .single();

        if (fileDataError || !fileData) {
          console.error(`Error retrieving file data for upload record: ${fileDataError?.message}`);
          return;
        }

        // Insert into invoice_uploads
        const { error: uploadError } = await supabase
          .from('invoice_uploads')
          .insert({
            user_id: userId,
            invoice_type: invoiceType === 'incoming' ? 'supplier' : 'sale',
            file_name: fileNames[index],
            file_path: fileData.file_path,
            storage_path: fileData.storage_path,
            file_size: fileData.file_size,
            file_id: fileId,
            sent_to_email: recipientEmail,
            sent_at: new Date().toISOString()
          });

        if (uploadError) {
          console.error(`Error recording upload history: ${uploadError.message}`);
        } else {
          console.log(`Recorded upload history for file: ${fileNames[index]}`);
        }
      });

      await Promise.all(fileUploads);
    } catch (uploadErr) {
      console.error("Failed to record upload history:", uploadErr);
    }

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

// Helper function to determine MIME type from filename
function getContentType(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return 'application/pdf';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    default:
      return 'application/octet-stream';
  }
}
