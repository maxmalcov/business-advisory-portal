import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { SubscriptionTool } from '@/types/subscriptions';
import SubscriptionTypeIcon from '@/pages/AdminSubscriptions/components/SubscriptionTypeIcon.tsx';
import { useLanguage } from '@/context/LanguageContext.tsx';

interface SubscriptionCardProps {
  tool: SubscriptionTool;
  onClick: (tool: SubscriptionTool) => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  tool,
  onClick,
}) => {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const { t } = useLanguage();

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-all"
      onClick={() => onClick(tool)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <SubscriptionTypeIcon type={tool.icon as any} />
          </div>
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(tool.status)}`}
          >
            {t(tool.status)}
          </div>
        </div>
        <CardTitle className="mt-2 text-lg">{tool.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{tool.description}</p>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;
