import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile, useIsSmallScreen } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';
import { FileChartLine } from 'lucide-react';

interface ReportsHeaderProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const ReportsHeader: React.FC<ReportsHeaderProps> = ({
  activeTab,
  setActiveTab
}) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const isSmallScreen = useIsSmallScreen();
  const { user } = useAuth();
  
  const isAdmin = user?.userType === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 pb-4 border-b">
        <div className="bg-primary/10 p-3 rounded-full">
          <FileChartLine className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('nav.reports')} {isAdmin && "(Admin)"}</h1>
          <p className="text-muted-foreground mt-1">
            Analyze platform metrics, track user activity, and monitor business performance
          </p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className={`mb-4 ${isMobile ? 'w-full grid grid-cols-2 gap-1' : ''} ${isSmallScreen ? 'flex flex-wrap' : ''}`}>
          <TabsTrigger value="overview" className={isMobile ? "w-full" : ""}>Overview</TabsTrigger>
          <TabsTrigger value="activity" className={isMobile ? "w-full" : ""}>Activity</TabsTrigger>
          
          {isAdmin && (
            <>
              <TabsTrigger value="invoices" className={isMobile ? "w-full" : ""}>Invoices</TabsTrigger>
              <TabsTrigger value="people" className={isMobile ? "w-full" : ""}>Users</TabsTrigger>
              <TabsTrigger value="services" className={isMobile ? "w-full" : ""}>Services</TabsTrigger>
              <TabsTrigger value="subscriptions" className={isMobile ? "w-full" : ""}>Subscriptions</TabsTrigger>
            </>
          )}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ReportsHeader;
