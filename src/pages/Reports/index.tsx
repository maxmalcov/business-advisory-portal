import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import ReportsHeader from './components/ReportsHeader';
import LoadingState from './components/LoadingState';
import OverviewTab from './components/overview/OverviewTab';
import ActivityTab from './components/activity/ActivityTab';
import DocumentsTab from './components/documents/DocumentsTab';
import PeopleTab from './components/people/PeopleTab';
import ServicesTab from './components/services/ServicesTab';
import SubscriptionsTab from './components/subscriptions/SubscriptionsTab';
import { useReportData } from './hooks/useReportData';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { 
    invoiceStats, 
    employeeStats, 
    servicesStats, 
    activityData, 
    monthlyData, 
    loading 
  } = useReportData();
  const { user } = useAuth();
  
  const isAdmin = user?.userType === 'admin';
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }
  
  useEffect(() => {
    if (!isAdmin && (activeTab === 'invoices' || activeTab === 'people' || activeTab === 'services')) {
      setActiveTab('overview');
    }
  }, [activeTab, isAdmin]);

  if (loading) {
    return (
      <div className="space-y-6">
        <ReportsHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ReportsHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="overview" className="space-y-6">
          <OverviewTab 
            invoiceStats={invoiceStats}
            employeeStats={employeeStats}
            servicesStats={servicesStats}
            activityData={activityData}
            monthlyData={monthlyData}
          />
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-4">
          <ActivityTab activityData={activityData} />
        </TabsContent>
        
        {isAdmin && (
          <>
            <TabsContent value="invoices" className="space-y-4">
              <DocumentsTab />
            </TabsContent>
            
            <TabsContent value="people" className="space-y-4">
              <PeopleTab employeeStats={employeeStats} />
            </TabsContent>

            <TabsContent value="services" className="space-y-4">
              <ServicesTab />
            </TabsContent>

            <TabsContent value="subscriptions" className="space-y-4">
              <SubscriptionsTab />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default ReportsPage;
