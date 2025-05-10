import { ReactNode } from 'react';

export type SubscriptionTool = {
  id: string;
  name: string;
  icon: ReactNode;
  description: string;
  status: 'active' | 'pending' | 'rejected' | 'inactive';
  iframeUrl?: string;
  demoVideoUrl: string;
};
