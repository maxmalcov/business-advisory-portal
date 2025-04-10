
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  UserPlus,
  UserMinus,
  Loader2,
  FileUp,
  Bell
} from 'lucide-react';
import { 
  ActivityEvent, 
  formatTimestamp, 
  getRecentActivity,
  getMockRecentActivity 
} from '@/utils/activity';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const truncateFileName = (fileName: string, maxLength: number = 40) => {
  if (fileName.length <= maxLength) return fileName;
  
  // For filenames with extension, preserve the extension
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex !== -1) {
    const extension = fileName.slice(lastDotIndex);
    const name = fileName.slice(0, lastDotIndex);
    if (name.length <= maxLength - 5) return fileName;
    
    return `${name.slice(0, maxLength - 5)}...${extension}`;
  }
  
  // For filenames without extension
  return `${fileName.slice(0, maxLength)}...`;
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

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{t('dashboard.recent_activity')}</h2>
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Recent Account Activity</CardTitle>
          <CardDescription>Recent events and changes to your account</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="py-8 text-center">
              <Loader2 className="animate-spin h-8 w-8 mx-auto text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">Loading activities...</p>
            </div>
          ) : activities.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-5">
              {activities.slice(0, 3).map((activity) => {
                // Determine icon based on activity type
                let ActivityIcon;
                switch (activity.type) {
                  case 'employee-added':
                    ActivityIcon = UserPlus;
                    break;
                  case 'employee-terminated':
                    ActivityIcon = UserMinus;
                    break;
                  case 'invoice-uploaded':
                  case 'supplier-invoice-uploaded':
                    ActivityIcon = FileUp;
                    break;
                  case 'service-completed':
                    ActivityIcon = FileText;
                    break;
                  default:
                    ActivityIcon = Bell;
                }
                
                // Check if description contains a long filename
                const needsTruncation = activity.description && 
                  (activity.description.includes('.pdf') || activity.description.length > 40);
                const displayDescription = needsTruncation ? 
                  truncateFileName(activity.description, 40) : 
                  activity.description;
                
                return (
                  <div key={activity.id} className="flex items-start space-x-4 p-2 rounded-md hover:bg-muted/50">
                    <div className="bg-muted p-2 rounded-full flex-shrink-0">
                      <ActivityIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{activity.title}</p>
                      {needsTruncation ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className="text-sm text-muted-foreground line-clamp-2">{displayDescription}</p>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-sm">
                              <p>{activity.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <p className="text-sm text-muted-foreground">{displayDescription}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">{formatTimestamp(activity.timestamp)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Link to="/reports" className="w-full">
            <Button variant="outline" className="w-full">View All Activity</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RecentActivity;
