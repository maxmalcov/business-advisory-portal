
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface SendEmailOptions {
  files: File[];
  message?: string;
}

export const useSupplierInvoiceEmail = () => {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const sendInvoiceByEmail = async ({ files, message }: SendEmailOptions) => {
    if (!user?.incomingInvoiceEmail) {
      toast({
        variant: 'destructive',
        title: 'Email Not Configured',
        description: `You don't have an incoming invoice email configured in your profile.`,
      });
      return false;
    }

    setIsSending(true);

    try {
      // Call the Supabase Edge Function to send email
      const { error } = await supabase.functions.invoke('send-invoice-email', {
        body: {
          recipientEmail: user.incomingInvoiceEmail,
          fileNames: files.map(file => file.name),
          userName: user?.name || 'User',
          invoiceType: 'incoming',
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
