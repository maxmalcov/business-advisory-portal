
export interface FormValues {
  id?: string;
  employeeId?: string;
  employeeName: string;
  companyName?: string;
  grossSalary: number;
  absenceDays?: number;
  medicalLeaveDate?: Date | string | null;
  notes?: string;
}
