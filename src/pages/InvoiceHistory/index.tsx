
import React from 'react';
import InvoiceHistoryHeader from './components/InvoiceHistoryHeader';
import InvoiceHistoryTabs from './components/InvoiceHistoryTabs';

const InvoiceHistory: React.FC = () => {
  return (
    <div className="space-y-6">
      <InvoiceHistoryHeader />
      <InvoiceHistoryTabs />
    </div>
  );
};

export default InvoiceHistory;
