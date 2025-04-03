
// Mock users for demonstration
export const mockUsers = [
  {
    id: '1',
    name: 'Example Client',
    email: 'client@example.com',
    companyName: 'Example SL',
    userType: 'client',
    incomingInvoiceEmail: 'invoices-in@example.com',
    outgoingInvoiceEmail: 'invoices-out@example.com',
    iframeUrls: ['https://example.com/iframe1', 'https://example.com/iframe2']
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@company.com',
    companyName: 'Smith LLC',
    userType: 'client',
    incomingInvoiceEmail: 'invoices@smith.com',
    outgoingInvoiceEmail: 'sales@smith.com',
    iframeUrls: ['https://smith.com/dashboard']
  },
  {
    id: '3',
    name: 'Mark Johnson',
    email: 'mark@enterprise.com',
    companyName: 'Johnson Enterprise',
    userType: 'client',
    incomingInvoiceEmail: 'accounts@johnson.com',
    outgoingInvoiceEmail: 'billing@johnson.com',
    iframeUrls: []
  }
];
