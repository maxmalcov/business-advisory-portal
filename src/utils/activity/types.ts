
import { formatDistanceToNow } from 'date-fns';

export type ActivityEventType = 
  | 'employee-added'
  | 'employee-terminated'
  | 'invoice-uploaded'
  | 'supplier-invoice-uploaded'
  | 'service-completed'
  | 'subscription-activated'
  | 'subscription-ended';

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  timestamp: Date;
  title: string;
  description: string;
  iconName?: string;
  metadata?: Record<string, any>;
}

export const formatTimestamp = (date: Date): string => {
  return formatDistanceToNow(date, { addSuffix: true });
};
