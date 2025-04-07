
export type EmployeeStatus = 'active' | 'terminated';

export interface Employee {
  id: string;
  fullName: string;
  position: string;
  status: EmployeeStatus;
  startDate: string;
  endDate?: string;
  companyName?: string;
  dniTie?: string;
  idDocument?: string;
  weeklySchedule?: string;
}
