
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
  
  // Additional fields that might be collected but not stored in DB
  email?: string;
  socialSecurityNumber?: string;
  salary?: string;
  salaryType?: SalaryType;
  iban?: string;
  address?: string;
  comments?: string;
}
