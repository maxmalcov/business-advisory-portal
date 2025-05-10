import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '../types/FormTypes';

interface TypeFieldProps {
  form: UseFormReturn<FormValues>;
}

const TypeField: React.FC<TypeFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Type</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="iframe">IFRAME</SelectItem>
              <SelectItem value="calendar">Calendar</SelectItem>
              <SelectItem value="crm">CRM</SelectItem>
              <SelectItem value="timetracking">Time Tracking</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TypeField;
