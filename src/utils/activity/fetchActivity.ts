
import { supabase, isUserAdmin, getUserCompanyName } from '@/integrations/supabase/client';
import { ActivityEvent, ActivityEventType } from './types';

export const getRecentActivity = async (): Promise<ActivityEvent[]> => {
  const activities: ActivityEvent[] = [];
  const now = new Date();
  const threeMonthsAgo = new Date(now);
  threeMonthsAgo.setMonth(now.getMonth() - 3);
  
  try {
    // Check if user is admin
    const isAdmin = await isUserAdmin();
    
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user && !isAdmin) {
      return []; // Return empty array if not authenticated and not admin
    }
    
    // Fetch employee activities - admins see all, users see only their company's
    let query = supabase.from('employees');
    
    if (!isAdmin) {
      // Get user's company name
      const companyName = await getUserCompanyName();
      
      if (companyName) {
        query = query.eq('company_name', companyName);
      } else {
        // If user has no company, they shouldn't see any employees
        query = query.eq('id', 'no-match');
      }
    }
    
    const { data: employees, error: employeesError } = await query
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

    // Fetch invoice uploads - admins see all, users see only their own
    let invoiceUploadsQuery = supabase.from('invoice_uploads');
    if (!isAdmin) {
      invoiceUploadsQuery = invoiceUploadsQuery.eq('user_id', user!.id);
    }
    
    const { data: invoiceUploads, error: invoiceUploadsError } = await invoiceUploadsQuery
      .select('id, file_name, invoice_type, created_at, user_id')
      .order('created_at', { ascending: false })
      .limit(15);

    if (invoiceUploadsError) {
      console.error('Error fetching invoice uploads:', invoiceUploadsError);
    } else if (invoiceUploads && invoiceUploads.length > 0) {
      // Get user information for each invoice
      const userIds = [...new Set(invoiceUploads.map(invoice => invoice.user_id))];
      const { data: userProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', userIds);
        
      if (profilesError) {
        console.error('Error fetching user profiles for invoices:', profilesError);
      }
      
      // Create a lookup map for user names
      const userNameMap = new Map();
      if (userProfiles) {
        userProfiles.forEach(profile => {
          userNameMap.set(profile.id, profile.name);
        });
      }
      
      // Process invoice uploads
      invoiceUploads.forEach(invoice => {
        const type = invoice.invoice_type === 'sale' ? 'invoice-uploaded' : 'supplier-invoice-uploaded';
        const title = invoice.invoice_type === 'sale' ? 'Sale invoice uploaded' : 'Supplier invoice uploaded';
        const userName = userNameMap.get(invoice.user_id) || 'User';
        
        activities.push({
          id: `invoice-upload-${invoice.id}`,
          type: type as ActivityEventType,
          timestamp: new Date(invoice.created_at),
          title: title,
          description: `A ${invoice.invoice_type || 'supplier'} invoice "${invoice.file_name}" was uploaded by ${userName}.`,
          metadata: { 
            invoiceId: invoice.id,
            userId: invoice.user_id,
            userName: userName
          }
        });
      });
    }
    
    // Fetch sales invoice uploads - admins see all, users see only their own
    let invoiceFilesQuery = supabase.from('invoice_files');
    if (!isAdmin) {
      invoiceFilesQuery = invoiceFilesQuery.eq('user_id', user!.id);
    }
    
    const { data: invoiceFiles, error: invoiceFilesError } = await invoiceFilesQuery
      .select('id, file_name, created_at, user_id')
      .order('created_at', { ascending: false })
      .limit(15);
      
    if (invoiceFilesError) {
      console.error('Error fetching invoice files:', invoiceFilesError);
    } else if (invoiceFiles && invoiceFiles.length > 0) {
      // Get user information for each invoice
      const userIds = [...new Set(invoiceFiles.map(invoice => invoice.user_id))];
      const { data: userProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', userIds);
        
      if (profilesError) {
        console.error('Error fetching user profiles for invoices:', profilesError);
      }
      
      // Create a lookup map for user names
      const userNameMap = new Map();
      if (userProfiles) {
        userProfiles.forEach(profile => {
          userNameMap.set(profile.id, profile.name);
        });
      }
      
      // Process invoice files as sale invoices
      invoiceFiles.forEach(invoice => {
        const userName = userNameMap.get(invoice.user_id) || 'User';
        
        activities.push({
          id: `invoice-file-${invoice.id}`,
          type: 'invoice-uploaded' as ActivityEventType,
          timestamp: new Date(invoice.created_at),
          title: 'Sale invoice uploaded',
          description: `A sale invoice "${invoice.file_name}" was uploaded by ${userName}.`,
          metadata: { 
            invoiceId: invoice.id,
            userId: invoice.user_id,
            userName: userName
          }
        });
      });
    }

    // Fetch service request completions - admins see all, users see only their own
    let servicesQuery = supabase.from('service_requests');
    if (!isAdmin) {
      servicesQuery = servicesQuery.eq('client_id', user!.id);
    }
    
    const { data: services, error: servicesError } = await servicesQuery
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

    console.log("Generated activity events:", activities.length);

    // Sort activities by timestamp (most recent first)
    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  } catch (error) {
    console.error('Error fetching activity data:', error);
    return [];
  }
};
