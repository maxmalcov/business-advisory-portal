
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

    // Fetch invoice uploads from invoice_uploads table (supplier invoices)
    const { data: invoiceUploads, error: invoiceUploadsError } = await supabase
      .from('invoice_uploads')
      .select('id, file_name, invoice_type, created_at, user_id')
      .order('created_at', { ascending: false })
      .limit(10);

    if (invoiceUploadsError) {
      console.error('Error fetching invoice uploads:', invoiceUploadsError);
    } else if (invoiceUploads) {
      // Get user profiles for displaying user names
      const userIds = [...new Set(invoiceUploads.map(invoice => invoice.user_id))];
      let userProfiles: Record<string, string> = {};
      
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, name')
          .in('id', userIds);
          
        if (profiles) {
          userProfiles = profiles.reduce((acc, profile) => {
            acc[profile.id] = profile.name || 'Unknown User';
            return acc;
          }, {} as Record<string, string>);
        }
      }
      
      // Process supplier invoices
      invoiceUploads.forEach(invoice => {
        const type = invoice.invoice_type === 'sale' ? 'invoice-uploaded' : 'supplier-invoice-uploaded';
        const title = invoice.invoice_type === 'sale' ? 'Sale invoice uploaded' : 'Supplier invoice uploaded';
        const userName = userProfiles[invoice.user_id] || 'A user';
        
        activities.push({
          id: `invoice-upload-${invoice.id}`,
          type: type as ActivityEventType,
          timestamp: new Date(invoice.created_at),
          title: title,
          description: `${userName} uploaded a ${invoice.invoice_type} invoice "${invoice.file_name}".`,
          metadata: { invoiceId: invoice.id, userId: invoice.user_id }
        });
      });
    }
    
    // Fetch invoice files (sale invoices)
    const { data: invoiceFiles, error: invoiceFilesError } = await supabase
      .from('invoice_files')
      .select('id, file_name, invoice_type, created_at, user_id')
      .order('created_at', { ascending: false })
      .limit(10);

    if (invoiceFilesError) {
      console.error('Error fetching invoice files:', invoiceFilesError);
    } else if (invoiceFiles) {
      // Get user profiles for displaying user names
      const userIds = [...new Set(invoiceFiles.map(invoice => invoice.user_id))];
      let userProfiles: Record<string, string> = {};
      
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, name')
          .in('id', userIds);
          
        if (profiles) {
          userProfiles = profiles.reduce((acc, profile) => {
            acc[profile.id] = profile.name || 'Unknown User';
            return acc;
          }, {} as Record<string, string>);
        }
      }
      
      // Process sale invoices
      invoiceFiles.forEach(invoice => {
        const userName = userProfiles[invoice.user_id] || 'A user';
        
        activities.push({
          id: `invoice-file-${invoice.id}`,
          type: 'invoice-uploaded' as ActivityEventType,
          timestamp: new Date(invoice.created_at),
          title: 'Sale invoice uploaded',
          description: `${userName} uploaded a sale invoice "${invoice.file_name}".`,
          metadata: { invoiceId: invoice.id, userId: invoice.user_id }
        });
      });
    }

    // Fetch service request completions
    const { data: services, error: servicesError } = await supabase
      .from('service_requests')
      .select('id, service_name, status, updated_at, client_id, client_name')
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
          description: `Service "${service.service_name}" for ${service.client_name} has been completed.`,
          metadata: { 
            serviceId: service.id, 
            serviceName: service.service_name,
            clientId: service.client_id
          }
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
