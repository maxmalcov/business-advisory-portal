
export interface FormData {
  companyName: string;
  employeeDni: string;
  startDate: Date | undefined;
  schedule: string;
  position: string;
  socialSecurityNumber: string;
  salary: string;
  salaryType: 'gross' | 'net';
  iban: string;
  address: string;
  employeeEmail: string;
  comments: string;
  idDocument: File | null;
}

export type FormErrors = Partial<Record<keyof FormData, string>>;
