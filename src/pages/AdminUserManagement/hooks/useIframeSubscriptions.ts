import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { User, IframeSubscription, SubscriptionHistoryEntry } from './types';
import { v4 as uuidv4 } from 'uuid';

// Predefined subscription types
const SUBSCRIPTION_TYPES = [
  { id: 'calendar', name: 'Calendar Tool' },
  { id: 'crm', name: 'CRM Integration' },
  { id: 'timetracking', name: 'Time Tracking' },
  { id: 'reporting', name: 'Reporting Dashboard' },
];

export const useIframeSubscriptions = (user: User) => {
  const [subscriptions, setSubscriptions] = useState<IframeSubscription[]>([]);
  const [history, setHistory] = useState<SubscriptionHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize subscriptions based on user's iframe URLs
  useEffect(() => {
    if (user && user.iframeUrls) {
      const today = new Date();
      const nextYear = new Date();
      nextYear.setFullYear(today.getFullYear() + 1);

      // Convert user's iframeUrls to subscription objects
      const initialSubscriptions: IframeSubscription[] = [];

      // Add all possible subscription types
      SUBSCRIPTION_TYPES.forEach((type, index) => {
        const url =
          user.iframeUrls && index < user.iframeUrls.length
            ? user.iframeUrls[index]
            : '';

        initialSubscriptions.push({
          id: type.id,
          name: type.name,
          url: url,
          status: url ? 'active' : 'inactive',
          startDate: url ? today : new Date(),
          endDate: url ? nextYear : undefined,
          isLifetime: url ? false : true,
        });
      });

      setSubscriptions(initialSubscriptions);

      // Generate sample history if we have active subscriptions
      const initialHistory: SubscriptionHistoryEntry[] = [];
      initialSubscriptions.forEach((sub) => {
        if (sub.status === 'active') {
          initialHistory.push({
            id: uuidv4(),
            subscriptionId: sub.id,
            date: new Date(sub.startDate),
            action: 'activated',
            adminName: 'System Admin',
          });
        }
      });

      setHistory(initialHistory);
      setLoading(false);
    }
  }, [user]);

  // Toggle subscription active status
  const toggleSubscriptionStatus = (subscriptionId: string) => {
    setSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.id === subscriptionId) {
          const newStatus = sub.status === 'active' ? 'inactive' : 'active';

          // Add to history
          const historyEntry: SubscriptionHistoryEntry = {
            id: uuidv4(),
            subscriptionId: sub.id,
            date: new Date(),
            action: newStatus === 'active' ? 'activated' : 'deactivated',
            adminName: 'Current Admin', // In a real app, get the current admin name
          };

          setHistory((prevHistory) => [historyEntry, ...prevHistory]);

          return {
            ...sub,
            status: newStatus,
            // If activating, set start date to today
            startDate: newStatus === 'active' ? new Date() : sub.startDate,
          };
        }
        return sub;
      }),
    );
  };

  // Update subscription period
  const updateSubscriptionPeriod = (
    subscriptionId: string,
    startDate: Date,
    endDate?: Date,
    isLifetime: boolean = false,
  ) => {
    setSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.id === subscriptionId) {
          // Create history entry with period changes
          const historyEntry: SubscriptionHistoryEntry = {
            id: uuidv4(),
            subscriptionId: sub.id,
            date: new Date(),
            action: 'period_updated',
            adminName: 'Current Admin', // In a real app, get the current admin name
            periodChanges: {
              oldStartDate: sub.startDate,
              newStartDate: startDate,
              oldEndDate: sub.endDate,
              newEndDate: endDate,
              oldIsLifetime: sub.isLifetime,
              newIsLifetime: isLifetime,
            },
          };

          setHistory((prevHistory) => [historyEntry, ...prevHistory]);

          return {
            ...sub,
            startDate,
            endDate,
            isLifetime,
          };
        }
        return sub;
      }),
    );
  };

  // Format date for display
  const formatDate = (date?: Date): string => {
    if (!date) return 'N/A';
    return format(date, 'MMMM dd, yyyy');
  };

  return {
    subscriptions,
    history,
    loading,
    toggleSubscriptionStatus,
    updateSubscriptionPeriod,
    formatDate,
  };
};
