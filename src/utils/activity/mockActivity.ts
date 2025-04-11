
import { ActivityEvent, ActivityEventType } from './types';

export const getMockRecentActivity = (): ActivityEvent[] => {
  const now = new Date();
  const oneDayAgo = new Date(now);
  oneDayAgo.setDate(now.getDate() - 1);
  
  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(now.getDate() - 2);
  
  const threeDaysAgo = new Date(now);
  threeDaysAgo.setDate(now.getDate() - 3);
  
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);
  
  const twoWeeksAgo = new Date(now);
  twoWeeksAgo.setDate(now.getDate() - 14);
  
  const mockActivity: ActivityEvent[] = [
    {
      id: 'mock-1',
      type: 'employee-added',
      timestamp: oneDayAgo,
      title: 'New employee added',
      description: 'Employee added – John Smith',
      metadata: { employeeId: 'emp-123' }
    },
    {
      id: 'mock-2',
      type: 'invoice-uploaded',
      timestamp: twoDaysAgo,
      title: 'Sale invoice uploaded',
      description: 'Sale invoice uploaded – "INVOICE#902635.pdf"',
      metadata: { invoiceId: 'inv-456' }
    },
    {
      id: 'mock-3',
      type: 'supplier-invoice-uploaded',
      timestamp: threeDaysAgo,
      title: 'Supplier invoice uploaded',
      description: 'Supplier invoice uploaded – "Referral_system_and_updates.pdf"',
      metadata: { invoiceId: 'inv-789' }
    },
    {
      id: 'mock-4',
      type: 'service-completed',
      timestamp: oneWeekAgo,
      title: 'Service completed',
      description: 'Service completed – "Monthly Accounting Report"',
      metadata: { serviceId: 'srv-012', serviceName: 'Monthly Accounting Report' }
    },
    {
      id: 'mock-5',
      type: 'employee-terminated',
      timestamp: twoWeeksAgo,
      title: 'Employee terminated',
      description: 'Employee terminated – Petru Hincu',
      metadata: { employeeId: 'emp-345' }
    },
    {
      id: 'mock-6',
      type: 'supplier-invoice-uploaded',
      timestamp: twoWeeksAgo,
      title: 'Supplier invoice uploaded',
      description: 'Supplier invoice uploaded – "GOLDMEDIA SRL.pdf"',
      metadata: { invoiceId: 'inv-678' }
    },
    {
      id: 'mock-7', 
      type: 'invoice-uploaded',
      timestamp: twoWeeksAgo,
      title: 'Sale invoice uploaded',
      description: 'Sale invoice uploaded – "Referral_system_and_updates_with_very_long_filename_that_exceeds_fifty_characters.pdf"',
      metadata: { invoiceId: 'inv-910' }
    }
  ];
  
  return mockActivity;
};
