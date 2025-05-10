import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { IconSelector } from './IconSelector';
import { SubscriptionTypeFormValues } from './schema';
import { useLanguage } from '@/context/LanguageContext.tsx';

interface FormFieldsProps {
  form: UseFormReturn<SubscriptionTypeFormValues>;
}

export const SubscriptionTypeFormFields: React.FC<FormFieldsProps> = ({
  form,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('subscriptions.admin.form.name')}</FormLabel>
            <FormControl>
              <Input
                placeholder={t('subscriptions.admin.form.name.placeholder')}
                {...field}
              />
            </FormControl>
            <FormDescription>
              {t('subscriptions.admin.form.name.help')}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('subscriptions.admin.form.description')}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t(
                  'subscriptions.admin.form.description.placeholder',
                )}
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              {t('subscriptions.admin.form.description.help')}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('subscriptions.admin.form.type')}</FormLabel>
            <FormControl>
              <Input
                placeholder={t('subscriptions.admin.form.type.placeholder')}
                {...field}
              />
            </FormControl>
            <FormDescription>
              {t('subscriptions.admin.form.type.help')}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <IconSelector form={form} />
    </div>
  );
};
