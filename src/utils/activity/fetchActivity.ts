
import { supabase } from '@/integrations/supabase/client';
import { ActivityEvent, ActivityEventType } from './types';

export const getRecentActivity = async (): Promise<ActivityEvent[]> => {
  const activities: ActivityEvent[] = [];
  const now = new Date();
  const threeMonthsAgo = new Date(now);
  threeMonthsAgo.setMonth(now.getMonth() - 3);
  
  try {
    // Fetch employee activities
    const { data: employees, error: employeesError } = await supabase
      .from('employees')
      .select('id, full_name, status, start_date, end_date, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (employeesError) {
      console.error('Error fetching employees:', employeesError);
    } else if (employees) {
      // Process added employees
      employees.forEach(employee => {
        const createdDate = new Date(employee.created_at || '');
        
        // Employee added
        activities.push({
          id: `employee-added-${employee.id}`,
          type: 'employee-added',
          timestamp: createdDate,
          title: 'New employee added',
          description: `${employee.full_name} was added as a new employee.`,
          metadata: { employeeId: employee.id }
        });
        
        // Employee terminated (if applicable)
        if (employee.status === 'terminated' && employee.end_date) {
          activities.push({
            id: `employee-terminated-${employee.id}`,
            type: 'employee-terminated',
            timestamp: new Date(employee.end_date),
            title: 'Employee terminated',
            description: `${employee.full_name}'s employment was terminated.`,
            metadata: { employeeId: employee.id }
          });
        }
      });
    }

    // Fetch invoice uploads
    const { data: invoices, error: invoicesError } = await supabase
      .from('invoice_uploads')
      .select('id, file_name, invoice_type, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (invoicesError) {
      console.error('Error fetching invoices:', invoicesError);
    } else if (invoices) {
      invoices.forEach(invoice => {
        const type = invoice.invoice_type === 'sale' ? 'invoice-uploaded' : 'supplier-invoice-uploaded';
        const title = invoice.invoice_type === 'sale' ? 'Sale invoice uploaded' : 'Supplier invoice uploaded';
        
        activities.push({
          id: `invoice-${invoice.id}`,
          type: type as ActivityEventType,
          timestamp: new Date(invoice.created_at),
          title: title,
          description: `A ${invoice.invoice_type} invoice "${invoice.file_name}" was uploaded.`,
          metadata: { invoiceId: invoice.id }
        });
      });
    }

    // Fetch service request completions
    const { data: services, error: servicesError } = await supabase
      .from('service_requests')
      .select('id, service_name, status, updated_at')
      .eq('status', 'completed')
      .order('updated_at', { ascending: false })
      .limit(5);

    if (servicesError) {
      console.error('Error fetching services:', servicesError);
    } else if (services) {
      services.forEach(service => {
        activities.push({
          id: `service-${service.id}`,
          type: 'service-completed',
          timestamp: new Date(service.updated_at),
          title: 'Service completed',
          description: `Service "${service.service_name}" has been completed.`,
          metadata: { serviceId: service.id, serviceName: service.service_name }
        });
      });
    }

    // Sort activities by timestamp (most recent first)
    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  } catch (error) {
    console.error('Error fetching activity data:', error);
    return [];
  }
};
