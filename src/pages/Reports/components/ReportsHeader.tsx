
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile, useIsSmallScreen } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';
import { FileText, Users, Package, Clock } from 'lucide-react';

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
      <h1 className="text-2xl font-bold tracking-tight">{t('nav.reports')}</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className={`mb-4 ${isMobile ? 'w-full grid grid-cols-2 gap-1' : ''} ${isSmallScreen ? 'flex flex-wrap' : ''}`}>
          <TabsTrigger value="overview" className={`${isMobile ? "w-full" : ""} ${activeTab === 'overview' ? 'bg-primary text-primary-foreground' : ''}`}>
            <span className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Overview
            </span>
          </TabsTrigger>
          <TabsTrigger value="activity" className={`${isMobile ? "w-full" : ""} ${activeTab === 'activity' ? 'bg-primary text-primary-foreground' : ''}`}>
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Activity
            </span>
          </TabsTrigger>
          
          {isAdmin && (
            <>
              <TabsTrigger value="documents" className={`${isMobile ? "w-full" : ""} ${activeTab === 'documents' ? 'bg-primary text-primary-foreground' : ''}`}>
                <span className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Documents
                </span>
              </TabsTrigger>
              <TabsTrigger value="people" className={`${isMobile ? "w-full" : ""} ${activeTab === 'people' ? 'bg-primary text-primary-foreground' : ''}`}>
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Users
                </span>
              </TabsTrigger>
            </>
          )}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ReportsHeader;
