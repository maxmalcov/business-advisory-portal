
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
import { FileUp, FileDown, Users, FileText, LayoutDashboard, Bell, FileIcon, Package, Sparkles } from 'lucide-react';
import RecentActivity from '@/components/dashboard/RecentActivity';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="border-l-4 border-l-ba-blue">
        <CardHeader>
          <CardTitle className="text-2xl">{t('dashboard.welcome')}</CardTitle>
          <CardDescription>
            {user?.name || user?.companyName}{' '}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Here's an overview of your account activity and quick access to essential features.</p>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">{t('dashboard.quick_actions')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link to="/invoices?tab=upload">
            <Card className="h-full card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <FileUp className="mr-2 h-5 w-5" />
                  Create Invoice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Upload new sales invoices to the system</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/supplier-invoices">
            <Card className="h-full card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <FileDown className="mr-2 h-5 w-5" />
                  Supplier Invoices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Upload and manage supplier invoices</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/hr/new-employee">
            <Card className="h-full card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  New Employee
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Start the hiring process for a new employee</p>
              </CardContent>
            </Card>
          </Link>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/services">
                  <Card className="h-full card-hover bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.03] animate-fade-in">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center text-white">
                        <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
                        Services
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-white/90">Browse and request additional paid services</p>
                    </CardContent>
                  </Card>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Explore available services for your company</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivity />

      {/* Stats Summary */}
      <div>
        <h2 className="text-xl font-semibold mb-4">{t('dashboard.stats')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Invoices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Uploaded This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Employees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Service Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
