
import React, {useEffect, useState} from 'react';
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
import {useLanguage} from "@/context/LanguageContext.tsx";
import {SubscriptionType} from "@/pages/AdminSubscriptionCatalog/hooks/useSubscriptionTypes.tsx";
import {subscriptionTypeTable} from "@/integrations/supabase/client.ts";

interface SubscriptionTypeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SubscriptionTypeFormData) => Promise<void>;
  editSubscription: SubscriptionType | null;
}

const SubscriptionTypeDialog: React.FC<SubscriptionTypeDialogProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  editSubscription,
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

  useEffect(() => {
    if (editSubscription){
      form.reset({
        name: editSubscription.name,
        description: editSubscription.description,
        type: editSubscription.type_id,
        iconType: editSubscription.icon_type,
      })
    } else {
      form.reset({
        name: '',
        description: '',
        type: '',
        iconType: 'iframe',
      })
    }

  }, [editSubscription]);

  const { isSubmitting } = form.formState;

  const {t} = useLanguage()

  const handleEditSubmit = async (values: SubscriptionTypeFormValues) => {
    try {
      const data: SubscriptionTypeFormData = {
        name: values.name,
        description: values.description,
        type_id: values.type,
        icon_type: values.iconType as 'iframe' | 'calendar' | 'crm' | 'timetracking',
      };

      await subscriptionTypeTable().update({
        name: data.name,
        description: data.description,
        type_id: data.type_id,
        icon_type: data.icon_type
      }).eq('id', editSubscription.id)

      onOpenChange(false)
      form.reset();

      toast({
        title: t('subscriptions.admin.created-edit'),
        description: t('subscriptions.admin.created.description-edit')
      });
    } catch (e: unknown){
      console.error('Error in edit handleSubmit:', e);
      toast({
        variant: "destructive",
        title: t('subscriptions.admin.toast.error'),
        description: t('subscriptions.admin.toast.error-edit.description')
      });
    }
  }

  const handleSubmit = async (values: SubscriptionTypeFormValues) => {
    try {
      const data: SubscriptionTypeFormData = {
        name: values.name,
        description: values.description,
        type_id: values.type,
        icon_type: values.iconType as 'iframe' | 'calendar' | 'crm' | 'timetracking',
      };
      
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        variant: "destructive",
        title: t('subscriptions.admin.toast.error'),
        description: t('subscriptions.admin.toast.error.description')
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editSubscription ? t('subscriptions.admin.edit-type') : t('subscriptions.admin.add-new-type')}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(editSubscription ? handleEditSubmit : handleSubmit)} className="space-y-4">
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
                {editSubscription ? t('subscriptions.admin.edit-button') : isSubmitting ? t('subscriptions.admin.creating') : t('subscriptions.admin.creating.type')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionTypeDialog;
