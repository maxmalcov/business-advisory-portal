
import React from 'react';
import InvoicesHeader from './components/InvoicesHeader';
import InvoiceTabs from './components/InvoiceTabs';

const Invoices: React.FC = () => {
  return (
    <div className="space-y-6">
      <InvoicesHeader />
      <InvoiceTabs />
    </div>
  );
};

export default Invoices;
