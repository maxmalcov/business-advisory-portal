
import { supabase } from '@/integrations/supabase/client';
import { ActivityEvent, ActivityEventType } from './types';

export const fetchInvoiceActivities = async (
  isAdmin: boolean,
  userId: string | undefined
): Promise<ActivityEvent[]> => {
  const activities: ActivityEvent[] = [];
  
  try {
    // Fetch invoice uploads - admins see all, users see only their own
    let invoiceUploadsQuery = supabase.from('invoice_uploads') as any;
    if (!isAdmin && userId) {
      invoiceUploadsQuery = invoiceUploadsQuery.eq('user_id', userId);
    }
    
    const { data: invoiceUploads, error: invoiceUploadsError } = await invoiceUploadsQuery
      .select('id, file_name, invoice_type, created_at, user_id')
      .order('created_at', { ascending: false })
      .limit(15);

    if (invoiceUploadsError) {
      console.error('Error fetching invoice uploads:', invoiceUploadsError);
    } else if (invoiceUploads && invoiceUploads.length > 0) {
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
    let invoiceFilesQuery = supabase.from('invoice_files') as any;
    if (!isAdmin && userId) {
      invoiceFilesQuery = invoiceFilesQuery.eq('user_id', userId);
    }
    
    const { data: invoiceFiles, error: invoiceFilesError } = await invoiceFilesQuery
      .select('id, file_name, created_at, user_id')
      .order('created_at', { ascending: false })
      .limit(15);
      
    if (invoiceFilesError) {
      console.error('Error fetching invoice files:', invoiceFilesError);
    } else if (invoiceFiles && invoiceFiles.length > 0) {
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
    
    return activities;
  } catch (error) {
    console.error('Error fetching invoice activities:', error);
    return [];
  }
};
