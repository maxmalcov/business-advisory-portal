
import { useAuth } from '@/context/AuthContext';
import {
  employeeWorkHoursTable,
  workHoursSubmissionsTable,
  supabase
} from '@/integrations/supabase/client';
import { ActivityEvent, ActivityEventType } from './types';
import { getMockRecentActivity } from './mockActivity';

// Function to fetch work hours submissions
export const fetchWorkHoursSubmissions = async (userId: string) => {
  try {
    const { data, error } = await workHoursSubmissionsTable()
      .select('*')
      .eq('client_id', userId)
      .order('month_year', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching work hours submissions:', error);
    return [];
  }
};

// Function to fetch employee work hours for a specific month
export const fetchEmployeeWorkHours = async (userId: string, monthYear: string) => {
  try {
    const { data, error } = await employeeWorkHoursTable()
      .select('*')
      .eq('client_id', userId)
      .eq('month_year', monthYear)
      .order('employee_name', { ascending: true });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching employee work hours:', error);
    return [];
  }
};

// Function to submit a month's work hours
export const submitWorkHoursMonth = async (userId: string, monthYear: string, hrEmail: string | null = null) => {
  try {
    const { data, error } = await workHoursSubmissionsTable().insert({
      client_id: userId,
      month_year: monthYear,
      hr_email: hrEmail,
      is_locked: true,
    });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error submitting work hours month:', error);
    throw error;
  }
};

// Implement the missing getRecentActivity function that was imported but not exported
export const getRecentActivity = async (): Promise<ActivityEvent[]> => {
  try {
    console.log("Fetching recent activity...");
    // In a real implementation, this would fetch from a database
    // For now, we're using the mock data as a placeholder
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return mock data
    return getMockRecentActivity();
  } catch (error) {
    console.error("Error fetching activity:", error);
    return [];
  }
};
