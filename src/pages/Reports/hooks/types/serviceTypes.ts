
import { DateRange } from '@/pages/AdminUserManagement/hooks/types';

export interface ServiceRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  serviceName: string;
  status: 'requested' | 'in_progress' | 'completed' | 'cancelled';
  requestDate: string;
  completionDate: string | null;
}

export interface ServiceStats {
  totalRequests: number;
  completed: number;
  inProgress: number;
  cancelled: number;
  mostRequestedService: string | null;
}

export interface ServiceChartData {
  month: string;
  count: number;
}

export interface ServiceFilters {
  dateRange: DateRange;
  dateFilterOption: 'thisMonth' | 'last3Months' | 'last6Months' | 'custom' | 'allTime';
  serviceType: string;
  status: string;
}

export interface UseServiceStatsReturn {
  serviceStats: ServiceStats;
  serviceRequests: ServiceRequest[];
  chartData: ServiceChartData[];
  loading: boolean;
  error: Error | null;
  filters: ServiceFilters;
  setFilters: (filters: Partial<ServiceFilters>) => void;
  exportToCSV: () => void;
}
