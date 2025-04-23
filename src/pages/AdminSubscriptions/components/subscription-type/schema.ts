
import * as z from 'zod';

export const subscriptionTypeFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  type: z.string()
    .min(1, 'Type is required')
    .refine(value => /^[a-z0-9-]+$/.test(value), {
      message: 'Type must contain only lowercase letters, numbers, and hyphens'
    }),
  iconType: z.enum(['iframe', 'calendar', 'crm', 'timetracking']),
});

export type SubscriptionTypeFormValues = z.infer<typeof subscriptionTypeFormSchema>;
