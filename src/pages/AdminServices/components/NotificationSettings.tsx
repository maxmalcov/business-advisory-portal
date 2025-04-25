import React from 'react';
import { Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNotificationSettings } from '@/hooks/useNotificationSettings';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
interface NotificationSettingsForm {
  hr_payroll: string;
  subscriptions: string;
  services: string;
}
const NotificationSettings = () => {
  const {
    settings,
    isLoading,
    isUpdating,
    updateSetting
  } = useNotificationSettings();
  const form = useForm<NotificationSettingsForm>();
  React.useEffect(() => {
    if (settings) {
      const formValues = settings.reduce((acc, setting) => ({
        ...acc,
        [setting.category]: setting.email
      }), {});
      form.reset(formValues);
    }
  }, [settings, form]);
  const onSubmit = async (category: string, email: string) => {
    updateSetting({
      category,
      email
    });
  };
  if (isLoading) {
    return <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Email Settings</h1>
              <p className="text-muted-foreground mt-1">
                Configure notification settings for different services
              </p>
            </div>
          </div>
        </div>
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading settings...</span>
            </div>
          </CardContent>
        </Card>
      </div>;
  }
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Email Settings</h1>
            <p className="text-muted-foreground mt-1">
              Configure notification settings for different services
            </p>
          </div>
        </div>
      </div>
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="space-y-6 rounded py-[15px]">
          {settings?.map(setting => <div key={setting.id} className="flex flex-col space-y-2">
              <Label htmlFor={setting.category}>
                {setting.category === 'hr_payroll' && 'HR & Payroll Notification Email'}
                {setting.category === 'subscriptions' && 'Subscriptions Notification Email'}
                {setting.category === 'services' && 'Additional Services Notification Email'}
              </Label>
              <div className="flex gap-2">
                <Input id={setting.category} type="email" value={form.watch(setting.category as keyof NotificationSettingsForm) || ''} onChange={e => {
              form.setValue(setting.category as keyof NotificationSettingsForm, e.target.value);
            }} placeholder={`e.g., ${setting.category}@yourcompany.com`} className="flex-grow rounded" />
                <Button onClick={() => onSubmit(setting.category, form.watch(setting.category as keyof NotificationSettingsForm))} disabled={isUpdating}>
                  {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
                </Button>
              </div>
            </div>)}
        </CardContent>
      </Card>
    </div>;
};
export default NotificationSettings;