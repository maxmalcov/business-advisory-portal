import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Calendar, Clock, Frame, PackageOpen, Users } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { SubscriptionTypeFormData } from '../hooks/useSubscriptionTypes';

// Schema for form validation
const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  type: z.string()
    .min(1, 'Type is required')
    .refine(value => /^[a-z0-9-]+$/.test(value), {
      message: 'Type must contain only lowercase letters, numbers, and hyphens'
    }),
  iconType: z.enum(['iframe', 'calendar', 'crm', 'timetracking']),
});

type SubscriptionTypeFormValues = z.infer<typeof formSchema>;

interface SubscriptionTypeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SubscriptionTypeFormData) => Promise<void>;
}

const SubscriptionTypeDialog: React.FC<SubscriptionTypeDialogProps> = ({
  isOpen,
  onOpenChange,
  onSubmit
}) => {
  const form = useForm<SubscriptionTypeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      type: '',
      iconType: 'iframe',
    },
  });

  const { isSubmitting } = form.formState;

  const handleSubmit = async (values: SubscriptionTypeFormValues) => {
    try {
      const data: SubscriptionTypeFormData = {
        name: values.name,
        description: values.description,
        type_id: values.type,
        icon_type: values.iconType as 'iframe' | 'calendar' | 'crm' | 'timetracking',
      };
      
      console.log('Prepared data for submission:', data);
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create subscription type. Please try again."
      });
    }
  };

  // Map of icons for each type
  const iconOptions = [
    { value: 'iframe', label: 'Web App', icon: <Frame className="h-5 w-5" /> },
    { value: 'calendar', label: 'Calendar', icon: <Calendar className="h-5 w-5" /> },
    { value: 'crm', label: 'CRM', icon: <Users className="h-5 w-5" /> },
    { value: 'timetracking', label: 'Time Tracking', icon: <Clock className="h-5 w-5" /> },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Subscription Type</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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

            <FormField
              control={form.control}
              name="iconType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
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
                    Choose an icon to represent this subscription type
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Subscription Type'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionTypeDialog;
