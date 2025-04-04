
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '../types/FormTypes';

interface UrlFieldsProps {
  form: UseFormReturn<FormValues>;
}

const UrlFields: React.FC<UrlFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter subscription URL" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="demoVideoUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Demo Video URL (Optional)</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter demo video URL" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default UrlFields;
