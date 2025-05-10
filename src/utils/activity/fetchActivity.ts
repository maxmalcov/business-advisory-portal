import { useAuth } from '@/context/AuthContext';
import {
  employeeWorkHoursTable,
  workHoursSubmissionsTable,
  supabase,
  logsTable,
} from '@/integrations/supabase/client';
import { ActivityEvent, ActivityEventType } from './types';

// Function to fetch work hours submissions
export const fetchWorkHoursSubmissions = async (userId: string) => {
  try {
    return (await getRecentActivity()) || [];
  } catch (error) {
    console.error('Error fetching work hours submissions:', error);
    return [];
  }
};

// Function to fetch employee work hours for a specific month
export const fetchEmployeeWorkHours = async (
  userId: string,
  monthYear: string,
) => {
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
export const submitWorkHoursMonth = async (
  userId: string,
  monthYear: string,
  hrEmail: string | null = null,
) => {
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
export const getRecentActivity = async (): Promise<any> => {
  try {
    const { data, error: activityError } = await logsTable()
      .select('*')
      .in('category', ['employee', 'subscription', 'invoice', 'service']);

    if (activityError) {
      throw new Error('Db error');
    }

    const mappedData: ActivityEvent[] = data.map((item: any) => {
      const newItem: any = {};
      newItem.id = item.id;
      newItem.type = item.category;
      newItem.timestamp = new Date(item.timestamp);
      newItem.title = item.action;
      newItem.description = item.description;
      newItem.iconName = item.category;

      return newItem;
    });

    return mappedData.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
    );
  } catch (error) {
    console.error('Error fetching activity:', error);
    return [];
  }
};
