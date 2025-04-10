
import { ActivityEventType } from './types';

export const getActivityIcon = (eventType: ActivityEventType) => {
  switch (eventType) {
    case 'employee-added':
      return 'UserPlus';
    case 'employee-terminated':
      return 'UserMinus';
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
