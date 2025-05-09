
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { FileText, Users, Package, Grid2X2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

interface StatsCardsProps {
  invoiceStats: {
    total: number;
    thisMonth: number;
  };
  employeeStats: {
    active: number;
    recentlyAdded: number;
  };
  servicesStats: {
    requested: number;
    completed: number;
    pending: number;
  };
  subscriptionStats: {
    total: number;
    active: number;
    pending: number;
  };
  onTabChange?: (tab: string) => void;
}

const StatsCards: React.FC<StatsCardsProps> = ({
  invoiceStats,
  employeeStats,
  servicesStats,
  subscriptionStats,
  onTabChange
}) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const getTexts = () => {
    return {
      totalInvoices: "Total Invoices",
      uploadedThisMonth: "uploaded this month",
      activeEmployees: "Active Employees",
      addedInLast30Days: "added in last 30 days",
      serviceRequests: "Service Requests",
      completed: "completed",
      pending: "pending",
      subscriptionRequests: "Subscription Requests",
      active: "active",
    };
  };
  
  const texts = getTexts();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card 
        className="cursor-pointer h-full transition-all duration-200 hover:bg-muted/50 hover:shadow-md"
        onClick={() => onTabChange?.('invoices')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{texts.totalInvoices}</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{invoiceStats.total}</div>
          <p className="text-xs text-muted-foreground">
            {invoiceStats.thisMonth} {texts.uploadedThisMonth}
          </p>
        </CardContent>
      </Card>

      <Card className="h-full transition-all duration-200 hover:bg-muted/50 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{texts.activeEmployees}</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{employeeStats.active}</div>
          <p className="text-xs text-muted-foreground">
            {employeeStats.recentlyAdded} {texts.addedInLast30Days}
          </p>
        </CardContent>
      </Card>
      
      <Card 
        className="cursor-pointer h-full transition-all duration-200 hover:bg-muted/50 hover:shadow-md"
        onClick={() => navigate('/admin/service-requests')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{texts.serviceRequests}</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{servicesStats.requested}</div>
          <p className="text-xs text-muted-foreground">
            {servicesStats.completed} {texts.completed}, {servicesStats.pending} {texts.pending}
          </p>
        </CardContent>
      </Card>
      
      <Card 
        className="cursor-pointer h-full transition-all duration-200 hover:bg-muted/50 hover:shadow-md"
        onClick={() => onTabChange?.('subscriptions')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{texts.subscriptionRequests}</CardTitle>
          <Grid2X2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{subscriptionStats.total}</div>
          <p className="text-xs text-muted-foreground">
            {subscriptionStats.active} {texts.active}, {subscriptionStats.pending} {texts.pending}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
