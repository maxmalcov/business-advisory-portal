
export type EmployeeStatus = 'active' | 'terminated';

export interface Employee {
  id: string;
  fullName: string;
  position: string;
  status: EmployeeStatus;
  startDate: string;
  endDate?: string;
}
