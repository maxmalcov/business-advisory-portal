
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { subscriptionAssignFormSchema, type SubscriptionAssignFormValues } from './schema';
import { AssignSubscriptionForm } from './AssignSubscriptionForm';

interface AssignSubscriptionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AssignSubscriptionDialog({ 
  isOpen, 
  onOpenChange,
  onSuccess 
}: AssignSubscriptionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SubscriptionAssignFormValues>({
    resolver: zodResolver(subscriptionAssignFormSchema),
    defaultValues: {
      userId: '',
      subscriptionTypeId: '',
      startDate: new Date(),
      endDate: null,
    },
  });

  const onSubmit = async (data: SubscriptionAssignFormValues) => {
    try {
      setIsSubmitting(true);
      
      const { data: subscriptionType, error: typeError } = await supabase
        .from('subscription_types')
        .select('*')
        .eq('type_id', data.subscriptionTypeId)
        .single();

      if (typeError) throw typeError;

      const { error: subscriptionError } = await supabase
        .from('user_tool_subscriptions')
        .insert({
          user_id: data.userId,
          tool_id: subscriptionType.type_id,
          tool_name: subscriptionType.name,
          status: 'active',
          start_date: data.startDate.toISOString(),
          end_date: data.endDate?.toISOString() || null,
          activated_at: new Date().toISOString(),
        });

      if (subscriptionError) throw subscriptionError;

      toast({
        title: "Success",
        description: "Subscription has been assigned successfully",
      });
      
      onOpenChange(false);
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error assigning subscription:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to assign subscription. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign a New Subscription</DialogTitle>
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
                Assign Subscription
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
