
import { z } from 'zod';
import { Subscription } from '../../types';

export const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['iframe', 'calendar', 'crm', 'timetracking']),
  userName: z.string().min(1, 'User name is required'),
  userId: z.string().min(1, 'User ID is required'),
  status: z.enum(['active', 'pending', 'rejected', 'inactive']),
  url: z.string().min(1, 'URL is required'),
  demoVideoUrl: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

export interface SubscriptionFormProps {
  subscription: Subscription | null;
  onSubmit: (data: Subscription) => void;
  onCancel: () => void;
}
