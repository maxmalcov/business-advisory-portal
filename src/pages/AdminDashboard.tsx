
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  FileText, 
  Bell, 
  BarChart3, 
  Settings,
  Activity,
  UserCog,
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="border-l-4 border-l-ba-blue">
        <CardHeader>
          <CardTitle className="text-2xl">{t('admin.dashboard')}</CardTitle>
          <CardDescription>
            Welcome back, {user?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Monitor your business activity and manage client accounts from this central dashboard.</p>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div>
        <h2 className="text-xl font-semibold mb-4">{t('admin.statistics')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                New This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Service Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">27</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Admin Actions */}
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

      {/* Recent Activity */}
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

      {/* Activity Chart (placeholder) */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Monthly Activity</h2>
        <Card>
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>Client activity for the past 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] bg-muted rounded-md flex items-center justify-center">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Chart visualization would appear here</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
