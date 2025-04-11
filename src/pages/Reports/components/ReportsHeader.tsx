
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile, useIsSmallScreen } from '@/hooks/use-mobile';

interface ReportsHeaderProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const ReportsHeader: React.FC<ReportsHeaderProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const isSmallScreen = useIsSmallScreen();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">{t('nav.reports')}</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className={`mb-4 ${isMobile ? 'w-full grid grid-cols-2 gap-1' : ''} ${isSmallScreen ? 'flex flex-wrap' : ''}`}>
          <TabsTrigger value="overview" className={isMobile ? "w-full" : ""}>Overview</TabsTrigger>
          <TabsTrigger value="activity" className={isMobile ? "w-full" : ""}>Activity</TabsTrigger>
          <TabsTrigger value="documents" className={isMobile ? "w-full" : ""}>Documents</TabsTrigger>
          <TabsTrigger value="people" className={isMobile ? "w-full" : ""}>People</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ReportsHeader;
