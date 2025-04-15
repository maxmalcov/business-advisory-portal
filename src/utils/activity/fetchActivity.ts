
import { supabase, isUserAdmin, getUserCompanyName } from '@/integrations/supabase/client';
import { ActivityEvent } from './types';
import { fetchEmployeeActivities } from './employeeActivities';
import { fetchInvoiceActivities } from './invoiceActivities';
import { fetchServiceActivities } from './serviceActivities';

export const getRecentActivity = async (): Promise<ActivityEvent[]> => {
  const activities: ActivityEvent[] = [];
  
  try {
    // Check if user is admin
    const isAdmin = await isUserAdmin();
    
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user && !isAdmin) {
      return []; // Return empty array if not authenticated and not admin
    }
    
    // Get user's company name (for employee activities)
    const companyName = !isAdmin ? await getUserCompanyName() : null;
    
    // Fetch all activities in parallel
    const [employeeActivities, invoiceActivities, serviceActivities] = await Promise.all([
      fetchEmployeeActivities(isAdmin, companyName),
      fetchInvoiceActivities(isAdmin, user?.id),
      fetchServiceActivities(isAdmin, user?.id)
    ]);
    
    // Combine all activities
    activities.push(...employeeActivities, ...invoiceActivities, ...serviceActivities);

    console.log("Generated activity events:", activities.length);

    // Sort activities by timestamp (most recent first)
    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  } catch (error) {
    console.error('Error fetching activity data:', error);
    return [];
  }
};
