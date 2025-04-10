
import React from 'react';
import { 
  FileText, 
  UserMinus, 
  UserPlus, 
  Calendar,
  FileUp,
  CheckCircle,
  Package,
  Clock,
  LucideIcon
} from 'lucide-react';
import { ActivityEvent } from '@/utils/activity';

interface ActivityIconProps {
  type: string;
  className?: string;
}

const ActivityIcon: React.FC<ActivityIconProps> = ({ type, className }) => {
  let Icon: LucideIcon;
  
  switch (type) {
    case 'employee-added':
      Icon = UserPlus;
      break;
    case 'employee-terminated':
      Icon = UserMinus;
      break;
    case 'invoice-uploaded':
    case 'supplier-invoice-uploaded':
      Icon = FileUp;
      break;
    case 'service-completed':
      Icon = CheckCircle;
      break;
    case 'subscription-activated':
    case 'subscription-ended':
      Icon = Package;
      break;
    default:
      Icon = Calendar;
  }
  
  return <Icon className={className || "h-5 w-5"} />;
};

export default ActivityIcon;
