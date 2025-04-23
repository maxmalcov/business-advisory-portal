
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { SubscriptionTypeFormData } from '../hooks/useSubscriptionTypes';
import { SubscriptionTypeFormFields } from './subscription-type/FormFields';
import { subscriptionTypeFormSchema, SubscriptionTypeFormValues } from './subscription-type/schema';

interface SubscriptionTypeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SubscriptionTypeFormData) => Promise<void>;
}

const SubscriptionTypeDialog: React.FC<SubscriptionTypeDialogProps> = ({
  isOpen,
  onOpenChange,
  onSubmit
}) => {
  const form = useForm<SubscriptionTypeFormValues>({
    resolver: zodResolver(subscriptionTypeFormSchema),
    defaultValues: {
      name: '',
      description: '',
      type: '',
      iconType: 'iframe',
    },
  });

  const { isSubmitting } = form.formState;

  const handleSubmit = async (values: SubscriptionTypeFormValues) => {
    try {
      const data: SubscriptionTypeFormData = {
        name: values.name,
        description: values.description,
        type_id: values.type,
        icon_type: values.iconType as 'iframe' | 'calendar' | 'crm' | 'timetracking',
      };
      
      console.log('Prepared data for submission:', data);
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create subscription type."
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Subscription Type</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <SubscriptionTypeFormFields form={form} />
            
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Subscription Type'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionTypeDialog;
