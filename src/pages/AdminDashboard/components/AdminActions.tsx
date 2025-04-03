
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Users,
  Settings,
  Activity,
  BarChart3,
  UserCog,
} from 'lucide-react';

const AdminActions: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{t('dashboard.quick_actions')}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Link to="/admin/users">
          <Card className="h-full card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">View and manage client accounts, assign emails and IFRAMEs</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/services">
          <Card className="h-full card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Service Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Configure available services and subscriptions</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/logs">
          <Card className="h-full card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                Log History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">View detailed logs of system activity and statistics</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/reports">
          <Card className="h-full card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Access and generate business reports and analytics</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/profile">
          <Card className="h-full card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <UserCog className="mr-2 h-5 w-5" />
                My Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Manage your account settings and preferences</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default AdminActions;
