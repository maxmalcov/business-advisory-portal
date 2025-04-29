
import React from 'react';
import { Calendar, Clock, Frame, Users } from 'lucide-react';
import { FormField, FormItem, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { SubscriptionTypeFormValues } from './schema';
import {useLanguage} from "@/context/LanguageContext.tsx";

interface IconSelectorProps {
  form: UseFormReturn<SubscriptionTypeFormValues>;
}

export const IconSelector: React.FC<IconSelectorProps> = ({ form }) => {
  const {t} = useLanguage()

  const iconOptions = [
    { value: 'iframe', label: t('subscriptions.admin.form.icon.label.web-app'), icon: <Frame className="h-5 w-5" /> },
    { value: 'calendar', label: t('subscriptions.admin.form.icon.label.calendar'), icon: <Calendar className="h-5 w-5" /> },
    { value: 'crm', label: t('subscriptions.admin.form.icon.label.crm'), icon: <Users className="h-5 w-5" /> },
    { value: 'timetracking', label: t('subscriptions.admin.form.icon.label.timetracking'), icon: <Clock className="h-5 w-5" /> },
  ];

  return (
    <FormField
      control={form.control}
      name="iconType"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {iconOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={field.value === option.value ? "default" : "outline"}
                  className={`flex items-center gap-2 justify-center h-20 ${
                    field.value === option.value ? "border-primary" : ""
                  }`}
                  onClick={() => field.onChange(option.value)}
                >
                  <div className="flex flex-col items-center gap-1">
                    {option.icon}
                    <span className="text-xs">{option.label}</span>
                  </div>
                </Button>
              ))}
            </div>
          </FormControl>
          <FormDescription>
              {t('subscriptions.admin.form.icon.description')}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
