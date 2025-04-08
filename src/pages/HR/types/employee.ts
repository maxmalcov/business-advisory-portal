
export type EmployeeStatus = 'active' | 'terminated';
export type SalaryType = 'gross' | 'net';

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
  
  // Additional fields now available in the database
  socialSecurityNumber?: string;
  salary?: string;
  salaryType?: SalaryType;
  iban?: string;
  email?: string;
  address?: string;
  comments?: string;
}
