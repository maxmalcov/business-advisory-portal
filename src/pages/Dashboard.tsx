
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { FileUp, FileDown, Users, Sparkles } from 'lucide-react';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { useReportData } from './Reports/hooks/useReportData';
import StatsCards from './Reports/components/overview/StatsCards';
import MonthlyInvoiceChart from './Reports/components/overview/MonthlyInvoiceChart';
import LoadingState from './Reports/components/LoadingState';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { 
    invoiceStats, 
    employeeStats, 
    servicesStats,
    subscriptionStats, 
    monthlyData, 
    loading 
  } = useReportData();
  
  return (
    <div className="space-y-6">
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

          <Link to="/services">
            <Card className="h-full card-hover bg-gradient-to-br from-[#5A8BB0] to-[#3A6B9E] text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.03] animate-fade-in">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-white">
                  <Sparkles className="mr-2 h-5 w-5 animate-[pulse_1.5s_cubic-bezier(0.4,0,0.6,1)_infinite] scale-110" />
                  Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/90">Browse and request additional paid services</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Reports Data */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Account Summary</h2>
        
        {loading ? (
          <LoadingState />
        ) : (
          <div className="space-y-6">
            <StatsCards 
              invoiceStats={invoiceStats}
              employeeStats={employeeStats}
              servicesStats={servicesStats}
              subscriptionStats={subscriptionStats}
            />
            
            <MonthlyInvoiceChart monthlyData={monthlyData} />
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
};

export default Dashboard;
