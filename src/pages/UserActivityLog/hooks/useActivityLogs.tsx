import { useState, useEffect, useCallback } from 'react';
import { ActivityEvent, getRecentActivity } from '@/utils/activity';
import { useToast } from '@/hooks/use-toast';

interface UseActivityLogsProps {
  itemsPerPage: number;
  currentPage: number;
  searchQuery: string;
}

export const useActivityLogs = ({
  itemsPerPage,
  currentPage,
  searchQuery,
}: UseActivityLogsProps) => {
  const { toast } = useToast();
  const [allActivities, setAllActivities] = useState<ActivityEvent[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityEvent[]>(
    [],
  );
  const [paginatedActivities, setPaginatedActivities] = useState<
    ActivityEvent[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch all activities
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const data = await getRecentActivity();
        setAllActivities(data);
        setFilteredActivities(data);
      } catch (err) {
        console.error('Error fetching activity data:', err);
        setError(
          err instanceof Error
            ? err
            : new Error('Unknown error fetching activity data'),
        );

        toast({
          variant: 'destructive',
          title: 'Error loading activity data',
          description:
            'There was a problem loading your activity data. Please try again later.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [toast]);

  // Filter activities based on search query
  const filterActivities = useCallback(
    (query: string) => {
      if (!query.trim()) {
        setFilteredActivities(allActivities);
        return;
      }

      const lowercaseQuery = query.toLowerCase();
      const filtered = allActivities.filter((activity) => {
        return (
          activity.type.toLowerCase().includes(lowercaseQuery) ||
          activity.title.toLowerCase().includes(lowercaseQuery) ||
          activity.description.toLowerCase().includes(lowercaseQuery)
        );
      });

      setFilteredActivities(filtered);
    },
    [allActivities],
  );

  // Update filtered activities when search query changes
  useEffect(() => {
    filterActivities(searchQuery);
  }, [searchQuery, filterActivities]);

  // Paginate the filtered activities
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedResults = filteredActivities.slice(startIndex, endIndex);

    setPaginatedActivities(paginatedResults);
  }, [currentPage, itemsPerPage, filteredActivities]);

  return {
    activities: paginatedActivities,
    loading,
    error,
    totalActivities: filteredActivities.length,
    filterActivities,
  };
};
