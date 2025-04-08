
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface FileInfo {
  id: string;
  name: string;
}

interface SendEmailOptions {
  invoiceType: 'incoming' | 'outgoing';
  files: FileInfo[];
  message?: string;
}

export const useInvoiceEmail = () => {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const sendInvoiceByEmail = async ({ invoiceType, files, message }: SendEmailOptions) => {
    const emailField = invoiceType === 'outgoing' ? user?.outgoingInvoiceEmail : user?.incomingInvoiceEmail;
    
    if (!emailField) {
      toast({
        variant: 'destructive',
        title: 'Email Not Configured',
        description: `You don't have an ${invoiceType} invoice email configured in your profile.`,
      });
      return false;
    }

    if (!files.length) {
      toast({
        variant: 'destructive',
        title: 'No Files Selected',
        description: 'Please select at least one file to send.',
      });
      return false;
    }

    setIsSending(true);

    try {
      // Call the Supabase Edge Function to send email with attachments
      const { error } = await supabase.functions.invoke('send-invoice-email', {
        body: {
          recipientEmail: emailField,
          fileIds: files.map(file => file.id),
          fileNames: files.map(file => file.name),
          userName: user?.name || 'User',
          companyName: user?.companyName,
          invoiceType,
          message,
          userId: user?.id
        }
      });

      if (error) {
        console.error('Error sending email:', error);
        toast({
          variant: 'destructive',
          title: 'Email Sending Failed',
          description: 'Could not send the invoice notification email.',
        });
        return false;
      }

      toast({
        title: 'Email Sent',
        description: `Invoice${files.length > 1 ? 's' : ''} successfully sent to ${emailField}.`,
      });

      return true;
    } catch (error) {
      console.error('Error invoking send-invoice-email function:', error);
      toast({
        variant: 'destructive',
        title: 'Email Sending Failed',
        description: 'Could not send the invoice notification email.',
      });
      return false;
    } finally {
      setIsSending(false);
    }
  };

  return {
    sendInvoiceByEmail,
    isSending
  };
};
