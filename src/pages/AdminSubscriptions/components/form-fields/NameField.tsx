
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '../types/FormTypes';

interface NameFieldProps {
  form: UseFormReturn<FormValues>;
}

const NameField: React.FC<NameFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Subscription Name</FormLabel>
          <FormControl>
            <Input {...field} placeholder="Enter subscription name" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default NameField;
