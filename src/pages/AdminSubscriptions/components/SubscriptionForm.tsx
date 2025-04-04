
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { SubscriptionFormProps, formSchema, FormValues } from './types/FormTypes';
import { Subscription } from '../types';
import NameField from './form-fields/NameField';
import TypeField from './form-fields/TypeField';
import UserInfoFields from './form-fields/UserInfoFields';
import StatusField from './form-fields/StatusField';
import UrlFields from './form-fields/UrlFields';
import FormActions from './form-fields/FormActions';

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ 
  subscription, 
  onSubmit, 
  onCancel 
}) => {
  const defaultValues: FormValues = subscription ? {
    name: subscription.name,
    type: subscription.type,
    userName: subscription.userName,
    userId: subscription.userId,
    status: subscription.status,
    url: subscription.url,
    demoVideoUrl: subscription.demoVideoUrl || '',
  } : {
    name: '',
    type: 'iframe',
    userName: '',
    userId: '',
    status: 'pending',
    url: '',
    demoVideoUrl: '',
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (data: FormValues) => {
    // Ensure all required properties are provided to satisfy the Subscription type
    const subscriptionData: Subscription = {
      id: subscription?.id || '',
      name: data.name,
      type: data.type,
      userName: data.userName,
      userId: data.userId,
      status: data.status,
      url: data.url,
      demoVideoUrl: data.demoVideoUrl,
      createdAt: subscription?.createdAt || new Date().toISOString(),
    };
    
    onSubmit(subscriptionData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <NameField form={form} />
        <TypeField form={form} />
        <UserInfoFields form={form} />
        <StatusField form={form} />
        <UrlFields form={form} />
        <FormActions subscription={subscription} onCancel={onCancel} />
      </form>
    </Form>
  );
};

export default SubscriptionForm;
