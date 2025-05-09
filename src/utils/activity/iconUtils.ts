
import { ActivityEventType } from './types';

export const getActivityIcon = (eventType) => {
  switch (eventType) {
    case 'employee':
      return 'UserPlus';
    case 'invoice-uploaded':
    case 'invoice':
      return 'FileText';
    case 'service':
      return 'CheckCircle';
    case 'subscription':
      return 'Package';
    default:
      return 'Bell';
  }
};
