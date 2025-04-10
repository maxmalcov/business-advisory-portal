
import React, { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
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
    loading,
    filterDataByDateRange
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
      
      <div>
        {activeTab === 'overview' && (
          <TabsContent value="overview" className="space-y-6" forceMount={true}>
            <OverviewTab 
              invoiceStats={invoiceStats}
              employeeStats={employeeStats}
              servicesStats={servicesStats}
              activityData={activityData}
              monthlyData={monthlyData}
              filterDataByDateRange={filterDataByDateRange}
            />
          </TabsContent>
        )}
        
        {activeTab === 'activity' && (
          <TabsContent value="activity" className="space-y-4" forceMount={true}>
            <ActivityTab activityData={activityData} />
          </TabsContent>
        )}
        
        {activeTab === 'documents' && (
          <TabsContent value="documents" className="space-y-4" forceMount={true}>
            <DocumentsTab invoiceStats={invoiceStats} />
          </TabsContent>
        )}
        
        {activeTab === 'people' && (
          <TabsContent value="people" className="space-y-4" forceMount={true}>
            <PeopleTab employeeStats={employeeStats} />
          </TabsContent>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
