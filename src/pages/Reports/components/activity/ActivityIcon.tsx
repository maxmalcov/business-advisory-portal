//
// import React from 'react';
// import {
//   Clock,
//   UserCheck,
//   UserMinus,
//   FileUp,
//   CheckCircle,
//   Package
// } from 'lucide-react';
// import { ActivityEventType } from '@/utils/activity';
//
// interface ActivityIconProps {
//   type: ActivityEventType;
// }
//
// const ActivityIcon: React.FC<ActivityIconProps> = ({ type }) => {
//   let IconComponent;
//
//   switch (type) {
//     case 'employee-added':
//       IconComponent = UserCheck;
//       break;
//     case 'employee-terminated':
//       IconComponent = UserMinus;
//       break;
//     case 'invoice-uploaded':
//     case 'supplier-invoice-uploaded':
//       IconComponent = FileUp;
//       break;
//     case 'service-completed':
//       IconComponent = CheckCircle;
//       break;
//     case 'subscription-activated':
//     case 'subscription-ended':
//       IconComponent = Package;
//       break;
//     default:
//       IconComponent = Clock;
//   }
//
//   return <IconComponent className="h-5 w-5" />;
// };
//
// export default ActivityIcon;
