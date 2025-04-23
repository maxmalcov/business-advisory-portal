
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { IconSelector } from './IconSelector';
import { SubscriptionTypeFormValues } from './schema';

interface FormFieldsProps {
  form: UseFormReturn<SubscriptionTypeFormValues>;
}

export const SubscriptionTypeFormFields: React.FC<FormFieldsProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Time Tracking" {...field} />
            </FormControl>
            <FormDescription>
              Display name for this subscription type
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
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Track and manage your work hours"
                className="min-h-[100px]" 
                {...field} 
              />
            </FormControl>
            <FormDescription>
              A brief description of what this subscription provides
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
            <FormLabel>Type (Slug)</FormLabel>
            <FormControl>
              <Input placeholder="timetracking" {...field} />
            </FormControl>
            <FormDescription>
              Internal identifier (lowercase letters, numbers, and hyphens only)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <IconSelector form={form} />
    </div>
  );
};
