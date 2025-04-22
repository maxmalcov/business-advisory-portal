
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { IframeSubscription } from './types';

// Define types for user activity data
export interface UserRegistrationInfo {
  registrationDate: Date;
}

export interface UserService {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'cancelled';
  requestDate: Date;
  adminAssigned?: string;
}

export interface UserSubscription {
  name: string;
  status: 'active' | 'cancelled' | 'expired';
  startDate: Date;
  endDate: Date;
}

export interface UserSubscriptionHistoryItem {
  id: string;
  name: string;
  action: 'activated' | 'cancelled' | 'renewed';
  date: Date;
}

export interface UserInvoiceItem {
  id: string;
  type: 'sale' | 'supplier';
  fileName: string;
  date: Date;
}

export interface UserInvoiceSummary {
  totalCount: number;
  saleInvoices: number;
  supplierInvoices: number;
  recentInvoices: UserInvoiceItem[];
}

export interface UserActivityData {
  registrationInfo: UserRegistrationInfo;
  services: UserService[];
  subscriptions: {
    active: IframeSubscription[];
    history: UserSubscriptionHistoryItem[];
  };
  invoices: UserInvoiceSummary;
}

// Hook to fetch and manage user activity data
export const useUserActivity = (userId: string) => {
  const { toast } = useToast();
  const [activityData, setActivityData] = useState<UserActivityData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserActivity = async () => {
      if (!userId) {
        console.error("No user ID provided to useUserActivity hook");
        setError("No user ID provided");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch the user's profile to get registration date
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('created_at, name, iframeurls')
          .eq('id', userId)
          .single();
        
        if (profileError) throw profileError;
        
        // Fetch the user's service requests
        const { data: servicesData, error: servicesError } = await supabase
          .from('service_requests')
          .select('id, service_name, status, request_date, admin_notes, updated_at')
          .eq('client_id', userId);
        
        if (servicesError) throw servicesError;
        
        // Process services data
        const services = servicesData?.map(service => ({
          id: service.id,
          name: service.service_name,
          status: service.status as 'completed' | 'in-progress' | 'cancelled',
          requestDate: new Date(service.request_date),
          adminAssigned: service.admin_notes ? 
            service.admin_notes.includes('Assigned to:') ? 
              service.admin_notes.split('Assigned to:')[1].trim() : undefined
            : undefined
        })) || [];
        
        // Fetch invoice files (sale invoices)
        const { data: invoiceFiles, error: invoiceFilesError } = await supabase
          .from('invoice_files')
          .select('id, file_name, created_at')
          .eq('user_id', userId);
          
        if (invoiceFilesError) {
          console.error("Error fetching invoice files:", invoiceFilesError);
          throw invoiceFilesError;
        }
        
        // Fetch supplier invoice files
        const { data: invoiceUploads, error: invoiceUploadsError } = await supabase
          .from('invoice_uploads')
          .select('id, file_name, created_at, invoice_type')
          .eq('user_id', userId);
          
        if (invoiceUploadsError) {
          console.error("Error fetching invoice uploads:", invoiceUploadsError);
          throw invoiceUploadsError;
        }
        
        console.log(`User ${userId} activity - invoices found:`, {
          invoiceFiles: invoiceFiles?.length || 0,
          invoiceUploads: invoiceUploads?.length || 0
        });
        
        // Process invoice data
        const saleInvoices = [
          ...(invoiceFiles || []).map(invoice => ({
            id: invoice.id,
            type: 'sale' as const,
            fileName: invoice.file_name,
            date: new Date(invoice.created_at)
          })),
          ...(invoiceUploads || []).filter(invoice => invoice.invoice_type === 'sale').map(invoice => ({
            id: invoice.id,
            type: 'sale' as const,
            fileName: invoice.file_name,
            date: new Date(invoice.created_at)
          }))
        ];
        
        const supplierInvoices = (invoiceUploads || [])
          .filter(invoice => invoice.invoice_type === 'supplier' || !invoice.invoice_type)
          .map(invoice => ({
            id: invoice.id,
            type: 'supplier' as const,
            fileName: invoice.file_name,
            date: new Date(invoice.created_at)
          }));
        
        // Combined and sorted invoice list
        const allInvoices = [...saleInvoices, ...supplierInvoices]
          .sort((a, b) => b.date.getTime() - a.date.getTime()); // Sort by date, newest first
        
        // Generate subscription data based on iframeUrls
        const today = new Date();
        const nextYear = new Date();
        nextYear.setFullYear(today.getFullYear() + 1);
        
        // Create active subscriptions based on iframe URLs
        const activeSubscriptions: IframeSubscription[] = [];
        
        // Add subscriptions based on the profile's iframe URLs
        if (profileData?.iframeurls && profileData.iframeurls.length > 0) {
          const subscriptionTypes = [
            { id: 'calendar', name: 'Calendar Tool' },
            { id: 'reporting', name: 'Reporting Dashboard' },
            { id: 'crm', name: 'CRM Integration' },
            { id: 'timetracking', name: 'Time Tracking' }
          ];
          
          // Create subscription objects for each type based on iframe URLs
          subscriptionTypes.forEach((type, index) => {
            const url = profileData.iframeurls && index < profileData.iframeurls.length 
              ? profileData.iframeurls[index] 
              : '';
            
            activeSubscriptions.push({
              id: type.id,
              name: type.name,
              url: url,
              status: url ? 'active' : 'inactive',
              startDate: url ? today : new Date(),
              endDate: url ? nextYear : undefined,
              isLifetime: url ? false : true
            });
          });
        }
        
        // Create the final activity data object
        const userActivityData: UserActivityData = {
          registrationInfo: {
            registrationDate: new Date(profileData.created_at)
          },
          services: services,
          subscriptions: {
            active: activeSubscriptions,
            history: services.length > 0 ? [
              {
                id: '1',
                name: 'Premium Plan',
                action: 'activated',
                date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              }
            ] : []
          },
          invoices: {
            totalCount: allInvoices.length,
            saleInvoices: saleInvoices.length,
            supplierInvoices: supplierInvoices.length,
            recentInvoices: allInvoices.slice(0, 3) // Get the 3 most recent invoices
          }
        };
        
        console.log("User activity data prepared:", {
          userId: userId,
          invoiceSummary: userActivityData.invoices,
          recentInvoices: userActivityData.invoices.recentInvoices
        });
        
        setActivityData(userActivityData);
      } catch (err) {
        console.error("Error fetching user activity data:", err);
        setError("Failed to load user activity data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (userId) {
      fetchUserActivity();
    }
  }, [userId, toast]);
  
  return { activityData, isLoading, error };
};
