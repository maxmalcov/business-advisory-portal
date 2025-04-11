
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  FileText, 
  Bell, 
  CheckCircle, 
  Package,
  UserPlus,
  UserMinus,
  Loader2
} from 'lucide-react';
import { 
  ActivityEvent, 
  formatTimestamp, 
  getActivityIcon, 
  getRecentActivity,
  getMockRecentActivity 
} from '@/utils/activity';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { truncateFileName, needsTruncation } from '@/utils/fileUtils';

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

const EmptyState: React.FC = () => (
  <div className="py-8 text-center">
    <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
    <h3 className="text-lg font-medium">No recent activity</h3>
    <p className="text-sm text-muted-foreground mt-2">
      Recent events will appear here as you use the system.
    </p>
  </div>
);

const RecentActivity: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const data = await getRecentActivity();
        setActivities(data);
      } catch (error) {
        console.error('Error fetching activities:', error);
        toast({
          variant: "destructive",
          title: "Error loading activities",
          description: "There was a problem loading your recent activities. Please try again later.",
        });
        // Fall back to mock data
        setActivities(getMockRecentActivity());
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [toast]);

  // Function to format the description with tooltips for long file names
  const formatDescription = (description: string) => {
    // Check if the description contains a dash with quoted content after it (new format)
    const dashMatch = description.match(/– "([^"]+)"/);
    
    if (dashMatch && dashMatch[1]) {
      const fileName = dashMatch[1];
      
      if (needsTruncation(fileName)) {
        const truncatedName = truncateFileName(fileName);
        const parts = description.split(`"${fileName}"`);
        const prefix = parts[0];
        const suffix = parts[1] || '';
        
        return (
          <>
            {prefix}
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
            {suffix}
          </>
        );
      }
    }
    
    return description;
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{t('dashboard.recent_activity')}</h2>
      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="py-8 text-center">
              <Loader2 className="animate-spin h-8 w-8 mx-auto text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">Loading activities...</p>
            </div>
          ) : activities.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              {activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <ActivityIcon type={activity.type} />
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{formatDescription(activity.description)}</p>
                    <p className="text-xs text-muted-foreground">{formatTimestamp(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className={isMobile ? "flex justify-center" : ""}>
          <Link to="/admin/logs">
            <Button variant="outline" className={isMobile ? "w-auto" : "w-full"}>View All Activity</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RecentActivity;
