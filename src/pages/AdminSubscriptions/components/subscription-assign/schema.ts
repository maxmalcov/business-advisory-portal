import * as z from 'zod';

export const subscriptionAssignFormSchema = z.object({
  startDate: z.date({
    required_error: 'Start date is required',
  }),
  endDate: z.date().nullable(),
});

export type SubscriptionAssignFormValues = z.infer<
  typeof subscriptionAssignFormSchema
>;
