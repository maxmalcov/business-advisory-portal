
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

export const getActivityIcon = (eventType: ActivityEventType) => {
  switch (eventType) {
    case 'employee-added':
    case 'employee-terminated':
      return 'Users';
    case 'invoice-uploaded':
    case 'supplier-invoice-uploaded':
      return 'FileText';
    case 'service-completed':
      return 'CheckCircle';
    case 'subscription-activated':
    case 'subscription-ended':
      return 'Package';
    default:
      return 'Bell';
  }
};

export const formatTimestamp = (date: Date): string => {
  return formatDistanceToNow(date, { addSuffix: true });
};

// Mock data for demo purposes - in a real app this would come from an API
export const getMockRecentActivity = (): ActivityEvent[] => {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000);

  return [
    {
      id: '1',
      type: 'employee-added',
      timestamp: oneHourAgo,
      title: 'New employee added',
      description: 'John Smith was added as a new employee.',
    },
    {
      id: '2',
      type: 'invoice-uploaded',
      timestamp: threeHoursAgo,
      title: 'Sale invoice uploaded',
      description: 'A sale invoice was uploaded.',
    },
    {
      id: '3',
      type: 'employee-terminated',
      timestamp: oneDayAgo,
      title: 'Employee terminated',
      description: 'Jane Doe\'s employment was terminated.',
    },
    {
      id: '4',
      type: 'supplier-invoice-uploaded',
      timestamp: twoDaysAgo,
      title: 'Supplier invoice uploaded',
      description: 'A supplier invoice was uploaded.',
    },
    {
      id: '5',
      type: 'service-completed',
      timestamp: fourDaysAgo,
      title: 'Service completed',
      description: 'Service "Payroll Setup" has been completed.',
      metadata: {
        serviceName: 'Payroll Setup'
      }
    },
    {
      id: '6',
      type: 'subscription-activated',
      timestamp: fourDaysAgo,
      title: 'Subscription activated',
      description: 'Subscription "Premium Plan" has been activated.',
      metadata: {
        subscriptionName: 'Premium Plan'
      }
    }
  ];
};
