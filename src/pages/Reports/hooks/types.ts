import { ActivityEvent } from '@/utils/activity';

export interface InvoiceStats {
  total: number;
  sales: number;
  supplier: number;
  thisMonth: number;
  lastMonth: number;
}

export interface EmployeeStats {
  total: number;
  active: number;
  terminated: number;
  recentlyAdded: number;
  registrationTrends: { date: string; count: number }[];
}

export interface ServicesStats {
  completed: number;
  pending: number;
  requested: number;
}

export interface SubscriptionStats {
  total: number;
  active: number;
  pending: number;
}

export interface MonthlyData {
  name: string;
  sales: number;
  supplier: number;
}

export interface ReportStats {
  invoiceStats: InvoiceStats;
  employeeStats: EmployeeStats;
  servicesStats: ServicesStats;
  subscriptionStats: SubscriptionStats;
  activityData: ActivityEvent[];
  monthlyData: MonthlyData[];
  loading: boolean;
}
