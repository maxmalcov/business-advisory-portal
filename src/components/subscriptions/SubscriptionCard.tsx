
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { SubscriptionTool } from '@/types/subscriptions';

interface SubscriptionCardProps {
  tool: SubscriptionTool;
  onClick: (tool: SubscriptionTool) => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ tool, onClick }) => {
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

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-all"
      onClick={() => onClick(tool)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="bg-blue-50 p-2 rounded-lg">
            {tool.icon}
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(tool.status)}`}>
            {tool.status.charAt(0).toUpperCase() + tool.status.slice(1)}
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
