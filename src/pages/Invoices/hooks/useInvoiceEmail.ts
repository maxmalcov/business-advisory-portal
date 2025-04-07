
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface SendEmailOptions {
  invoiceType: 'incoming' | 'outgoing';
  files: File[];
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

    setIsSending(true);

    try {
      // Call the Supabase Edge Function to send email
      const { error } = await supabase.functions.invoke('send-invoice-email', {
        body: {
          recipientEmail: emailField,
          fileNames: files.map(file => file.name),
          userName: user?.name || 'User',
          invoiceType,
          message
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
