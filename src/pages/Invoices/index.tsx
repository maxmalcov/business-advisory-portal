
import React from 'react';
import InvoicesHeader from './components/InvoicesHeader';
import InvoiceTabs from './components/InvoiceTabs';

const Invoices: React.FC = () => {
  return (
    <div className="space-y-8 max-w-[1200px] mx-auto animate-fade-in">
      <InvoicesHeader />
      <InvoiceTabs />
    </div>
  );
};

export default Invoices;
