
import React from 'react';
import { PackageOpen, Calendar, Users, Clock } from 'lucide-react';

type SubscriptionTypeIconProps = {
  type: string;
};

const SubscriptionTypeIcon: React.FC<SubscriptionTypeIconProps> = ({ type }) => {
  switch(type) {
    case 'iframe':
      return <PackageOpen className="h-5 w-5 text-primary" />;
    case 'calendar':
      return <Calendar className="h-5 w-5 text-primary" />;
    case 'crm':
      return <Users className="h-5 w-5 text-primary" />;
    case 'timetracking':
      return <Clock className="h-5 w-5 text-primary" />;
    default:
      return <PackageOpen className="h-5 w-5 text-primary" />;
  }
};

export default SubscriptionTypeIcon;
