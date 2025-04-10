
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import ReportsHeader from './components/ReportsHeader';
import LoadingState from './components/LoadingState';
import OverviewTab from './components/overview/OverviewTab';
import ActivityTab from './components/activity/ActivityTab';
import DocumentsTab from './components/documents/DocumentsTab';
import PeopleTab from './components/people/PeopleTab';
import { useReportData } from './hooks/useReportData';

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
        
        <TabsContent value="documents" className="space-y-4">
          <DocumentsTab invoiceStats={invoiceStats} />
        </TabsContent>
        
        <TabsContent value="people" className="space-y-4">
          <PeopleTab employeeStats={employeeStats} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
