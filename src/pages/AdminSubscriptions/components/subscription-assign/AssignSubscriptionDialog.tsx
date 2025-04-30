
import {useEffect, useState} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import {subscriptionRequestsTable, supabase} from '@/integrations/supabase/client';
import { subscriptionAssignFormSchema, type SubscriptionAssignFormValues } from './schema';
import { AssignSubscriptionForm } from './AssignSubscriptionForm';
import {useLanguage} from "@/context/LanguageContext.tsx";
import {Subscription} from "@/pages/AdminSubscriptions/types.ts";

interface AssignSubscriptionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  subscription: Subscription;
}

export function AssignSubscriptionDialog({ 
  isOpen, 
  onOpenChange,
  onSuccess,
  subscription
}: AssignSubscriptionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {t} = useLanguage()

  const form = useForm<SubscriptionAssignFormValues>({
    resolver: zodResolver(subscriptionAssignFormSchema),
    defaultValues: {
      startDate: new Date(),
      endDate: null,
    },
  });

  useEffect(() => {
    (async () => {
      if(isOpen){
        const { data, error } = await subscriptionRequestsTable().select('*').eq('id', subscription.id).single()

        if(error){
          throw new Error('Server error')
        }

        form.reset({
          startDate: (data as any).activated_at,
          endDate: (data as any).expires_at,
        })
      }
    })()
  }, [isOpen]);

  const onSubmit = async (data: SubscriptionAssignFormValues) => {
    try {
      setIsSubmitting(true);

      await subscriptionRequestsTable().update({
        activated_at: data.startDate,
        expires_at: data.endDate,
      }).eq('id', subscription.id)

      toast({
        title: t('subscription.admin.toast.success.title'),
        description: t('subscription.admin.toast.success.description'),
      });
      
      onOpenChange(false);
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error assigning subscription:', error);
      toast({
        variant: "destructive",
        title: t('subscription.admin.toast.failed.title'),
        description: t('subscription.admin.toast.failed.description'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('subscription.admin.assign-new')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <AssignSubscriptionForm />
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {t('subscription.admin.assign-new.button')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
