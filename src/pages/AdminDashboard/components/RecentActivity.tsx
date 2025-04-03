
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
import { Users, FileText, Bell } from 'lucide-react';

const RecentActivity: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{t('dashboard.recent_activity')}</h2>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="bg-muted p-2 rounded-full">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">New client registered</p>
                <p className="text-sm text-muted-foreground">Example Corporation completed registration</p>
                <p className="text-xs text-muted-foreground">30 minutes ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-muted p-2 rounded-full">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Invoice batch processed</p>
                <p className="text-sm text-muted-foreground">15 client invoices were processed</p>
                <p className="text-xs text-muted-foreground">3 hours ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-muted p-2 rounded-full">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Service request received</p>
                <p className="text-sm text-muted-foreground">New HR service request from Client #42</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Link to="/admin/logs">
            <Button variant="outline" className="w-full">View All Activity</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RecentActivity;
