
import React from 'react';
import { ActivityEvent, formatTimestamp, getActivityIcon } from '@/utils/activity';
import { Card, CardContent } from '@/components/ui/card';
import { Users, FileText, Bell, CheckCircle, Package, UserPlus, UserMinus } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { truncateFileName, needsTruncation } from '@/utils/fileUtils';

interface ActivityLogItemProps {
  activity: ActivityEvent;
}

const iconComponents = {
  Users,
  FileText,
  Bell,
  CheckCircle,
  Package,
  UserPlus,
  UserMinus
};

const ActivityIcon: React.FC<{ type: string }> = ({ type }) => {
  const iconName = getActivityIcon(type as any);
  const IconComponent = iconComponents[iconName as keyof typeof iconComponents] || Bell;
  
  return (
    <div className="bg-muted p-2 rounded-full">
      <IconComponent className="h-5 w-5" />
    </div>
  );
};

const ActivityLogItem: React.FC<ActivityLogItemProps> = ({ activity }) => {
  // Function to format the description with tooltips for long file names
  const formatDescription = (description: string) => {
    // Check if the description contains quotes (likely indicating a file name)
    const fileNameMatch = description.match(/"([^"]+)"/);
    
    if (fileNameMatch && fileNameMatch[1]) {
      const fileName = fileNameMatch[1];
      
      if (needsTruncation(fileName)) {
        const truncatedName = truncateFileName(fileName);
        const parts = description.split(`"${fileName}"`);
        
        return (
          <>
            {parts[0]}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="font-medium">"{truncatedName}"</span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[400px]">
                  {fileName}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {parts[1]}
          </>
        );
      }
    }
    
    return description;
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <ActivityIcon type={activity.type} />
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-1">
              <span className="font-medium text-xs px-2 py-1 rounded-full bg-muted capitalize">
                {activity.type.split('-').join(' ')}
              </span>
              <span className="text-xs text-muted-foreground">
                {`${String(activity.timestamp.getDate()).padStart(2, '0')}-${String(activity.timestamp.getMonth() + 1).padStart(2, '0')}-${activity.timestamp.getFullYear()} ${String(activity.timestamp.getHours()).padStart(2, '0')}:${String(activity.timestamp.getMinutes()).padStart(2, '0')}`}
              </span>
            </div>
            <p className="font-medium">{activity.title}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {formatDescription(activity.description)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityLogItem;
