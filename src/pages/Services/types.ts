
import { ReactNode } from 'react';

export type ServiceStatus = 'available' | 'pending' | 'completed' | 'rejected';

export interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  price: string;
  badges?: string[];
  popular?: boolean;
  status?: ServiceStatus;
  onRequestService: (serviceId: string) => void;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string; // Changed from icon: ReactNode to iconName: string
  price: string;
  badges?: string[];
  popular?: boolean;
  status: ServiceStatus;
}
