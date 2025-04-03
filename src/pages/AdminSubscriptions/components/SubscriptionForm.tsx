
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Subscription } from '../types';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['iframe', 'calendar', 'crm', 'timetracking']),
  userName: z.string().min(1, 'User name is required'),
  userId: z.string().min(1, 'User ID is required'),
  status: z.enum(['active', 'pending', 'rejected', 'inactive']),
  url: z.string().min(1, 'URL is required'),
  demoVideoUrl: z.string().optional(),
});

type SubscriptionFormProps = {
  subscription: Subscription | null;
  onSubmit: (data: Subscription) => void;
  onCancel: () => void;
};

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ 
  subscription, 
  onSubmit, 
  onCancel 
}) => {
  const defaultValues = subscription ? {
    ...subscription
  } : {
    name: '',
    type: 'iframe' as const,
    userName: '',
    userId: '',
    status: 'pending' as const,
    url: '',
    demoVideoUrl: '',
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit({
      id: subscription?.id || '',
      ...data,
      createdAt: subscription?.createdAt || new Date().toISOString(),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter user name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User ID</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter user ID" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {subscription ? 'Save Changes' : 'Add Subscription'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default SubscriptionForm;
