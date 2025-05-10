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
  setActiveTab,
}) => {
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();
  const isSmallScreen = useIsSmallScreen();
  const { user } = useAuth();

  const isAdmin = user?.userType === 'admin';

  const getTexts = () => {
    if (language === 'es') {
      return {
        reports: 'Informes',
        admin: '(Admin)',
        description:
          'Analice métricas de la plataforma, rastree la actividad del usuario y supervise el rendimiento del negocio',
        overview: 'Vista General',
        activity: 'Actividad',
        invoices: 'Facturas',
        users: 'Usuarios',
        services: 'Servicios',
        subscriptions: 'Suscripciones',
      };
    } else {
      return {
        reports: t('nav.reports'),
        admin: '(Admin)',
        description:
          'Analyze platform metrics, track user activity, and monitor business performance',
        overview: 'Overview',
        activity: 'Activity',
        invoices: 'Invoices',
        users: 'Users',
        services: 'Services',
        subscriptions: 'Subscriptions',
      };
    }
  };

  const texts = getTexts();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 pb-4 border-b">
        <div className="bg-primary/10 p-3 rounded-full">
          <FileChartLine className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {texts.reports} {isAdmin && texts.admin}
          </h1>
          <p className="text-muted-foreground mt-1">{texts.description}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList
          className={`mb-4 ${isMobile ? 'w-full grid grid-cols-2 gap-1' : ''} ${isSmallScreen ? 'flex flex-wrap' : ''}`}
        >
          <TabsTrigger value="overview" className={isMobile ? 'w-full' : ''}>
            {texts.overview}
          </TabsTrigger>
          <TabsTrigger value="activity" className={isMobile ? 'w-full' : ''}>
            {texts.activity}
          </TabsTrigger>

          {isAdmin && (
            <>
              <TabsTrigger
                value="invoices"
                className={isMobile ? 'w-full' : ''}
              >
                {texts.invoices}
              </TabsTrigger>
              <TabsTrigger value="people" className={isMobile ? 'w-full' : ''}>
                {texts.users}
              </TabsTrigger>
              <TabsTrigger
                value="services"
                className={isMobile ? 'w-full' : ''}
              >
                {texts.services}
              </TabsTrigger>
              <TabsTrigger
                value="subscriptions"
                className={isMobile ? 'w-full' : ''}
              >
                {texts.subscriptions}
              </TabsTrigger>
            </>
          )}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ReportsHeader;
