
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { ActivityEvent, formatTimestamp, getActivityIcon } from '@/utils/activity';
import { Users, FileText, Bell, CheckCircle, Package, UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import ActivityLogItem from './ActivityLogItem';
import { useLanguage } from '@/context/LanguageContext';

interface ActivityLogTableProps {
  activities: ActivityEvent[];
  loading: boolean;
}

const EmptyState: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="py-16 text-center">
      <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">{t('activity.no_results')}</h3>
      <p className="text-sm text-muted-foreground mt-2">
        {t('common.empty')}
      </p>
    </div>
  );
};

const LoadingState: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="py-12 text-center">
      <Loader2 className="animate-spin h-8 w-8 mx-auto text-muted-foreground" />
      <p className="mt-2 text-muted-foreground">{t('common.loading')}</p>
    </div>
  );
};

const ActivityLogTable: React.FC<ActivityLogTableProps> = ({ activities, loading }) => {
  const isMobile = useIsMobile();
  const { t } = useLanguage();

  if (loading) {
    return <LoadingState />;
  }

  if (activities.length === 0) {
    return <EmptyState />;
  }

  // Mobile view shows cards instead of a table
  if (isMobile) {
    return (
      <div className="space-y-4">
        {activities.map((activity) => (
          <ActivityLogItem 
            key={activity.id} 
            activity={activity} 
          />
        ))}
      </div>
    );
  }

  // Desktop view shows a table
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">{t('activity.type')}</TableHead>
              <TableHead>{t('activity.title')}</TableHead>
              <TableHead>{t('activity.description')}</TableHead>
              <TableHead className="w-[180px] text-right">{t('activity.date')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <ActivityIcon type={activity.type} />
                    <span className="font-medium text-xs capitalize">
                      {activity.type.split('-').join(' ')}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{activity.title}</TableCell>
                <TableCell className="text-muted-foreground">{activity.description}</TableCell>
                <TableCell className="text-right text-muted-foreground text-sm">
                  {formatTimestamp(activity.timestamp)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// Activity icon component
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
    <div className="bg-muted p-1.5 rounded-full">
      <IconComponent className="h-4 w-4" />
    </div>
  );
};

export default ActivityLogTable;
