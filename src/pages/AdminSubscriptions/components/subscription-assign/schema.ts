
import * as z from 'zod';

export const subscriptionAssignFormSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  subscriptionTypeId: z.string().min(1, 'Subscription type is required'),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date().nullable(),
});

export type SubscriptionAssignFormValues = z.infer<typeof subscriptionAssignFormSchema>;
