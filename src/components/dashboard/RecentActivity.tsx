
import React from 'react';
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
  UserMinus
} from 'lucide-react';
import { 
  ActivityEvent, 
  formatTimestamp, 
  getActivityIcon, 
  getMockRecentActivity 
} from '@/utils/activityUtils';

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

const RecentActivity: React.FC = () => {
  const { t } = useLanguage();
  const recentActivities = getMockRecentActivity();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{t('dashboard.recent_activity')}</h2>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {recentActivities.slice(0, 3).map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4">
                <ActivityIcon type={activity.type} />
                <div>
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{formatTimestamp(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Link to="/reports">
            <Button variant="outline" className="w-full">View All Activity</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RecentActivity;
