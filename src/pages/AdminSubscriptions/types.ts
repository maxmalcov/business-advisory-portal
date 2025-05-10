export type Subscription = {
  id: string;
  name: string;
  type: 'iframe' | 'calendar' | 'crm' | 'timetracking';
  userName: string;
  userId: string;
  status: 'active' | 'pending' | 'rejected' | 'inactive';
  url: string;
  demoVideoUrl?: string;
  createdAt: string;
  stoppedByAdmin: boolean;
  clientCanRequestAgain: boolean;
  lastRequestDate?: string;
};
