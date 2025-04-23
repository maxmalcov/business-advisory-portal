
export interface SubscriptionStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  cancelledSubscriptions: number;
}

export interface SubscriptionFilters {
  dateRange: {
    from: Date;
    to: Date;
  };
  dateFilterOption: 'last30days' | 'thisYear' | 'custom' | 'allTime';
  status: 'all' | 'active' | 'expired' | 'cancelled';
  planType: 'all' | 'monthly' | 'yearly';
  search: string;
}

export interface SubscriptionData {
  id: string;
  clientName: string;
  planName: string;
  status: 'active' | 'pending' | 'rejected' | 'inactive' | 'expired' | 'cancelled';
  activationDate: string;
  expirationDate: string;
  type: 'monthly' | 'yearly';
}

export interface SubscriptionChartData {
  month: string;
  count: number;
}
