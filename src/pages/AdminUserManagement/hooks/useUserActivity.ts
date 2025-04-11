
import { useState, useEffect } from 'react';

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
    active?: UserSubscription;
    history: UserSubscriptionHistoryItem[];
  };
  invoices: UserInvoiceSummary;
}

// Hook to fetch and manage user activity data
export const useUserActivity = (userId: string) => {
  const [activityData, setActivityData] = useState<UserActivityData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserActivity = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real application, this would be an API call
        // Here we're just using mock data for demonstration
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data
        const mockUserData: UserActivityData = {
          registrationInfo: {
            registrationDate: new Date(2024, 2, 15, 10, 30), // March 15, 2024, 10:30 AM
          },
          services: [
            { id: '1', name: 'Payroll Setup', status: 'completed', requestDate: new Date(2024, 3, 5), adminAssigned: 'John Doe' },
            { id: '2', name: 'Tax Filing', status: 'in-progress', requestDate: new Date(2024, 3, 10), adminAssigned: 'Jane Smith' },
            { id: '3', name: 'Financial Reporting', status: 'cancelled', requestDate: new Date(2024, 2, 20), adminAssigned: 'Mark Johnson' },
          ],
          subscriptions: {
            active: { name: 'Premium Plan', status: 'active', startDate: new Date(2024, 3, 1), endDate: new Date(2025, 3, 1) },
            history: [
              { id: '1', name: 'Basic Plan', action: 'activated', date: new Date(2024, 0, 15) },
              { id: '2', name: 'Basic Plan', action: 'cancelled', date: new Date(2024, 2, 28) },
              { id: '3', name: 'Premium Plan', action: 'activated', date: new Date(2024, 3, 1) },
            ]
          },
          invoices: {
            totalCount: 24,
            saleInvoices: 18,
            supplierInvoices: 6,
            recentInvoices: [
              { id: '1', type: 'sale', fileName: 'Invoice_202404_001.pdf', date: new Date(2024, 3, 8) },
              { id: '2', type: 'supplier', fileName: 'Supplier_Invoice_Q1_2024.pdf', date: new Date(2024, 3, 5) },
              { id: '3', type: 'sale', fileName: 'Invoice_202403_045.pdf', date: new Date(2024, 2, 30) },
            ]
          }
        };
        
        setActivityData(mockUserData);
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
  }, [userId]);
  
  return { activityData, isLoading, error };
};
