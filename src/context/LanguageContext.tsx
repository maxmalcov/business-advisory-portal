import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Languages
export type Language = 'es' | 'en' | 'ru';

// Context type
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

// Translations - we'll expand this as needed
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Common
    'app.title': 'Business Advisory Portal',
    'app.login': 'Login',
    'app.logout': 'Logout',
    'app.register': 'Register',
    'app.welcome': 'Welcome to Business Advisory',
    'app.error': 'An error occurred',
    'app.loading': 'Loading...',
    'app.save': 'Save',
    'app.cancel': 'Cancel',
    'app.submit': 'Submit',
    'app.back': 'Back',
    'app.next': 'Next',
    'app.close': 'Close',
    'app.search': 'Search',
    'app.add': 'Add',
    'app.edit': 'Edit',
    'app.delete': 'Delete',
    'app.language': 'Language',
    'app.success': 'Success',
    'app.warning': 'Warning',
    'app.info': 'Information',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.sale_invoices': 'Sale Invoices',
    'nav.sale_invoices.create': 'Create New',
    'nav.supplier_invoices': 'Supplier Invoices',
    'nav.hr': 'HR & Payroll',
    'nav.hr.new_employee': 'New Employee',
    'nav.hr.termination': 'Employee Termination',
    'nav.hr.work_hours': 'Work Hours',
    'nav.contracts': 'Contracts',
    'nav.documents': 'Documents',
    'nav.reports': 'Reports',
    'nav.profile': 'My Profile',
    'nav.services': 'Service Management',
    'nav.users': 'User Management',
    'nav.additional_services': 'Additional Services',
    'nav.subscriptions': 'Subscriptions',
    
    // Auth
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.forgot_password': 'Forgot Password?',
    'auth.login_success': 'Logged in successfully',
    'auth.logout_success': 'Logged out successfully',
    'auth.register_success': 'Registered successfully',
    
    // Dashboard
    'dashboard.welcome': 'Welcome to your dashboard',
    'dashboard.recent_activity': 'Recent Activity',
    'dashboard.stats': 'Statistics',
    'dashboard.quick_actions': 'Quick Actions',
    
    // Invoices
    'invoices.title': 'Sale Invoices',
    'invoices.upload': 'Upload',
    'invoices.history': 'History',
    'invoices.date': 'Date',
    'invoices.amount': 'Amount',
    'invoices.client': 'Client',
    'invoices.status': 'Status',
    'invoices.upload_success': 'Invoices uploaded successfully',
    'invoices.max_size': 'Maximum file size per upload: 25MB',
    'invoices.max_files': 'Upload up to 15 files at once',
    'invoices.allowed_types': 'Allowed file types: PDF or JPG',
    
    // Supplier Invoices
    'supplier_invoices.title': 'Supplier Invoices',
    
    // HR & Payroll
    'hr.new_employee.title': 'Hiring New Employee',
    'hr.new_employee.company': 'Company Name',
    'hr.new_employee.dni': 'Employee DNI or TIE',
    'hr.new_employee.start_date': 'Start Date',
    'hr.new_employee.schedule': 'Weekly Working Schedule',
    'hr.new_employee.days_off': 'Employee must have two consecutive days off',
    'hr.new_employee.position': 'Job Position',
    'hr.new_employee.ss_number': 'Social Security Number',
    'hr.new_employee.salary': 'Monthly Salary',
    'hr.new_employee.iban': 'IBAN',
    'hr.new_employee.address': 'Full Address',
    'hr.new_employee.email': 'Employee Email',
    'hr.new_employee.comments': 'Additional Comments',
    
    'hr.termination.title': 'Employee Termination',
    'hr.termination.employee': 'Employee Name',
    'hr.termination.date': 'Termination Date',
    'hr.termination.vacation': 'Vacation Days Used',
    'hr.termination.reason': 'Reason for Termination',
    
    'hr.work_hours.title': 'Monthly Work Hours',
    'hr.work_hours.salary': 'Monthly Bruto Salary',
    'hr.work_hours.notes': 'Notes',
    'hr.work_hours.absence': 'Absence Days',
    'hr.work_hours.medical': 'Medical Leave Date',

    // Registration
    'registration.title': 'Register Account',
    'registration.language': 'Preferred Language',
    'registration.type': 'Account Type',
    'registration.type.freelancer': 'Freelancer / Sole Proprietor',
    'registration.type.sl': 'Limited Company (SL)',
    'registration.type.sa': 'Corporation (SA)',
    'registration.type.individual': 'Private Individual',
    'registration.name': 'Full Name',
    'registration.company': 'Company Name',
    'registration.admin_name': 'Administrator Name',
    'registration.nif': 'NIF (Tax ID)',
    'registration.address': 'Address',
    'registration.postal': 'Postal Code',
    'registration.city': 'City',
    'registration.province': 'Province',
    'registration.country': 'Country',
    'registration.email': 'Email',
    'registration.phone': 'Phone',
    
    // Admin
    'admin.dashboard': 'Admin Dashboard',
    'admin.logs': 'Log History',
    'admin.manage_users': 'Manage Users',
    'admin.manage_services': 'Manage Services',
    'admin.statistics': 'Statistics',
    
    // Services
    'services.request': 'Request Service',
    'services.status.requested': 'Requested',
    'services.status.pending': 'Pending',
    'services.status.completed': 'Completed',
    'services.status.rejected': 'Rejected',
    
    // Subscriptions
    'subscriptions.title': 'Available Subscriptions',
    'subscriptions.request': 'Request Service',
    'subscriptions.demo': 'Watch Demo',
    'subscriptions.iframe1': 'IFRAME 1',
    'subscriptions.iframe2': 'IFRAME 2',
    'subscriptions.crm': 'CRM',
    'subscriptions.timetracking': 'Time Tracking',
    
    // Common pages
    'page.under_construction': 'This page is under construction',
    
    // Contracts & Documents
    'contracts.title': 'Contracts Management',
    'contracts.description': 'View and manage your business contracts',
    'documents.title': 'Document Management',
    'documents.description': 'Access and manage your important documents',
    
    // Reports
    'reports.title': 'Reports & Analytics',
    'reports.description': 'View detailed reports about your business activities',

    // Logs
    'logs.history.title': 'System Log History',
    'logs.history.description': 'Track and monitor all system activities and events',

    'logs.type': 'Type',
    'logs.action': 'Action',
    'logs.user': 'User',
    'logs.description': 'Description',
    'logs.timestamp': 'Timestamp',
    'logs.level': 'Level',

    'logs.search.placeholder': 'Search logs...',
    'logs.export': 'Export Logs',
    'logs.categories': 'All Categories',
    'logs.email': 'Email',
    'logs.service': 'Service',
    'logs.invoice': 'Invoice',

    'logs.register_action': 'User registration',
    'logs.register_description': 'New user registered: ',
  },
  
  es: {

  },
  ru: {}
};

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && ['en', 'es', 'ru'].includes(savedLang)) {
      setLanguageState(savedLang);
    }
  }, []);

  // Update localStorage when language changes
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for easy access
export const useLanguage = () => useContext(LanguageContext);
