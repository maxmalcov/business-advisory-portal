
export interface FormData {
  companyName: string;
  fullName: string;
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
  idDocumentUrl?: string;
}

export type FormErrors = Partial<Record<keyof FormData, string>>;
