
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { User } from './types';
import { format, startOfMonth, sub } from 'date-fns';

export const useFetchUsers = () => {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userStats, setUserStats] = useState({
    total: 0,
    active: 0,
    recentlyAdded: 0,
    thisMonth: 0,
    registrationData: []
  });

  // Fetch users from profiles table
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching users from profiles table as", currentUser?.userType);
      
      // With our RLS policies, admins can see all profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }
      
      if (profilesData) {
        console.log("Fetched profiles:", profilesData);
        
        // Transform the profiles data to match our User interface
        const transformedUsers: User[] = profilesData.map(profile => {
          // Check if user is inactive by looking for -inactive suffix
          const isUserActive = !profile.usertype?.includes('-inactive');
          const cleanUserType = profile.usertype?.replace('-inactive', '') || 'client';
          
          return {
            id: profile.id,
            name: profile.name || '',
            email: profile.email || '',
            companyName: profile.companyname || '',
            userType: cleanUserType,
            incomingInvoiceEmail: profile.incominginvoiceemail || '',
            outgoingInvoiceEmail: profile.outgoinginvoiceemail || '',
            iframeUrls: [], // This may need to be added to the profiles table
            isActive: isUserActive,
            phone: profile.phone || '',
            address: profile.address || '',
            postalCode: profile.postalcode || '',
            city: profile.city || '',
            province: profile.province || '',
            country: profile.country || '',
            nif: profile.nif || '',
            accountType: profile.accounttype || ''
          };
        });
        
        // Calculate user statistics
        const activeUsers = transformedUsers.filter(user => user.isActive);
        
        // Calculate recently added users (within the last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentlyAddedUsers = profilesData.filter(profile => {
          const createdAt = new Date(profile.created_at);
          return createdAt >= thirtyDaysAgo;
        });
        
        // Calculate users added this month
        const firstDayOfMonth = startOfMonth(new Date());
        const thisMonthUsers = profilesData.filter(profile => {
          const createdAt = new Date(profile.created_at);
          return createdAt >= firstDayOfMonth;
        });
        
        // Generate data for the registration growth chart
        // Get data for the last 30 days
        const registrationData = [];
        const today = new Date();
        
        // Create a map to count users registered on each date
        const dateCountMap = new Map();
        
        // Initialize map with zeros for the last 30 days
        for (let i = 29; i >= 0; i--) {
          const date = sub(today, { days: i });
          const dateStr = format(date, 'yyyy-MM-dd');
          dateCountMap.set(dateStr, 0);
        }
        
        // Count registrations for each date
        profilesData.forEach(profile => {
          const createdAt = new Date(profile.created_at);
          // Only consider if within the last 30 days
          if (createdAt >= thirtyDaysAgo) {
            const dateStr = format(createdAt, 'yyyy-MM-dd');
            if (dateCountMap.has(dateStr)) {
              dateCountMap.set(dateStr, dateCountMap.get(dateStr) + 1);
            }
          }
        });
        
        // Convert the map to array for the chart
        dateCountMap.forEach((count, date) => {
          registrationData.push({ date, count });
        });
        
        // Sort by date ascending
        registrationData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        // Update the stats state
        setUserStats({
          total: transformedUsers.length,
          active: activeUsers.length,
          recentlyAdded: recentlyAddedUsers.length,
          thisMonth: thisMonthUsers.length,
          registrationData
        });
        
        console.log("Transformed users:", transformedUsers);
        setUsers(transformedUsers);
      } else {
        console.log("No profiles data returned from Supabase");
        setUsers([]);
        setUserStats({
          total: 0,
          active: 0,
          recentlyAdded: 0,
          thisMonth: 0,
          registrationData: []
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load users'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.companyName?.toLowerCase().includes(searchQuery.toLowerCase() || '')
  );

  return {
    users: filteredUsers,
    isLoading,
    searchQuery,
    setSearchQuery,
    refreshUsers: fetchUsers,
    userStats
  };
};
