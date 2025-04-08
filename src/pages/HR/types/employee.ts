
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
  idDocumentUrl?: string;
  weeklySchedule?: string;
}

// Database mapping helpers to convert between API and database field naming
export const toDbEmployee = (employee: Employee) => ({
  id: employee.id,
  full_name: employee.fullName,
  position: employee.position,
  status: employee.status,
  start_date: employee.startDate,
  end_date: employee.endDate || null,
  company_name: employee.companyName || null,
  dni_tie: employee.dniTie || null,
  id_document: employee.idDocument || null,
  id_document_url: employee.idDocumentUrl || null,
  weekly_schedule: employee.weeklySchedule || null
});

export const fromDbEmployee = (dbRecord: any): Employee => ({
  id: dbRecord.id,
  fullName: dbRecord.full_name || '',
  position: dbRecord.position || '',
  status: (dbRecord.status as EmployeeStatus) || 'active',
  startDate: dbRecord.start_date || '',
  endDate: dbRecord.end_date || undefined,
  companyName: dbRecord.company_name || undefined,
  dniTie: dbRecord.dni_tie || undefined,
  idDocument: dbRecord.id_document || undefined,
  idDocumentUrl: dbRecord.id_document_url || undefined,
  weeklySchedule: dbRecord.weekly_schedule || undefined
});
