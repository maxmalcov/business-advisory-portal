
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNotificationSettings } from '@/hooks/useNotificationSettings';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';

interface NotificationSettingsForm {
  hr_payroll: string;
  subscriptions: string;
  services: string;
}

const NotificationSettings = () => {
  const { settings, isLoading, isUpdating, updateSetting } = useNotificationSettings();
  const form = useForm<NotificationSettingsForm>();

  React.useEffect(() => {
    if (settings) {
      const formValues = settings.reduce((acc, setting) => ({
        ...acc,
        [setting.category]: setting.email,
      }), {});
      form.reset(formValues);
    }
  }, [settings, form]);

  const onSubmit = async (category: string, email: string) => {
    updateSetting({ category, email });
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading settings...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Configure where service request notifications are sent</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {settings?.map((setting) => (
          <div key={setting.id} className="flex flex-col space-y-2">
            <Label htmlFor={setting.category}>
              {setting.category === 'hr_payroll' && 'HR & Payroll Notification Email'}
              {setting.category === 'subscriptions' && 'Subscriptions Notification Email'}
              {setting.category === 'services' && 'Additional Services Notification Email'}
            </Label>
            <div className="flex gap-2">
              <Input
                id={setting.category}
                type="email"
                value={form.watch(setting.category as keyof NotificationSettingsForm) || ''}
                onChange={(e) => {
                  form.setValue(setting.category as keyof NotificationSettingsForm, e.target.value);
                }}
                className="flex-grow"
                placeholder={`e.g., ${setting.category}@yourcompany.com`}
              />
              <Button 
                onClick={() => onSubmit(setting.category, form.watch(setting.category as keyof NotificationSettingsForm))}
                disabled={isUpdating}
              >
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
