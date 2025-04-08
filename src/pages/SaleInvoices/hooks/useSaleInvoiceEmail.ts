
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface FileInfo {
  id: string;
  name: string;
}

interface SendEmailOptions {
  files: FileInfo[];
  message?: string;
}

export const useSaleInvoiceEmail = () => {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const sendInvoiceByEmail = async ({ files, message }: SendEmailOptions) => {
    if (!user?.outgoingInvoiceEmail) {
      toast({
        variant: 'destructive',
        title: 'Email Not Configured',
        description: `You don't have an outgoing invoice email configured in your profile.`,
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
          recipientEmail: user.outgoingInvoiceEmail,
          fileIds: files.map(file => file.id),
          fileNames: files.map(file => file.name),
          userName: user?.name || 'User',
          companyName: user?.companyName,
          invoiceType: 'outgoing',
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
        description: `Invoice${files.length > 1 ? 's' : ''} successfully sent to ${user.outgoingInvoiceEmail}.`,
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
