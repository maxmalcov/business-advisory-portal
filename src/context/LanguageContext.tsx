import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Languages
export type Language = 'es' | 'en';

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
    'nav.invoices': 'Invoices',
    'nav.useful-links': 'Useful Links',

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
    'admin.subscriptions': 'Subscription Management',
    'admin.subscriptions.requests': 'Subscription Requests',
    'admin.subscriptions.catalog': 'Subscription Catalog',
    'admin.useful-links': 'Useful Links',
    'admin.service': 'Service Management',
    'admin.service.requests': 'Service Requests',
    'admin.service.catalog': 'Service Catalog',
    'admin.email-settings': 'Email Settings',

    // Useful Links
    'useful-links.search.placeholder': 'Search for resources...',
    'useful-links.error-loading': 'Error loading resources. Please try again later.',
    'useful-links.table.all': 'All',
    'useful-links.table.social-security': 'Social Security',
    'useful-links.table.no-resources': 'No resources match your search.',
    'useful-links.table.no-available-resources': 'No resources available yet.',
    'Taxes':'Taxes',
    'Legal':'Legal',
    'Social Security':'Social Security',
    'Employment':'Employment',
    'Business':'Business',
    'Banking':'Banking',
    'Health':'Health',
    'Education':'Education',
    'General':'General',
    // P.S. thanks fucking AI:)

    // Services
    'services.request': 'Request Service',
    'services.status.requested': 'Requested',
    'services.status.pending': 'Pending',
    'services.status.completed': 'Completed',
    'services.status.rejected': 'Rejected',

    'services.title': 'Title',
    'services.description': 'Description',
    'services.price': 'Price',
    'services.category': 'Category',
    'services.status': 'Status',
    'services.created': 'Created',
    'services.actions': 'Actions',
    'services.additional_services': 'Additional Services',
    'services.additional_services.desc': 'Explore our premium services designed to help your business thrive',
    'services.search.placeholder': 'Search services...',
    'services.no-available': 'No services available at the moment',
    'services.details': 'Service Details',
    'services.editor.title': 'Service Title',
    'services.editor.title.placeholder': 'Enter service title',
    'services.editor.description': 'Description',
    'services.editor.description.placeholder': 'Enter service description',
    'services.editor.price': 'Price',
    'services.editor.price.placeholder': 'Enter price',
    'services.editor.icon': 'Icon',
    'services.editor.icon.placeholder': 'Select an icon',
    'services.editor.icon.package': 'Package',
    'services.editor.icon.document': 'Document',
    'services.editor.icon.briefcase': 'Briefcase',
    'services.editor.icon.users': 'Users',
    'services.editor.icon.payment': 'Payment',
    'services.editor.icon.calendar': 'Calendar',
    'services.editor.icon.security': 'Security',
    'services.editor.icon.premium': 'Premium',
    'services.editor.badges': 'Badges (comma separated)',
    'services.editor.badges.placeholder': 'New, Popular, Premium',
    'services.editor.category': 'Category',
    'services.editor.category.placeholder': 'Enter category',
    'services.status.category': 'Status',
    'services.status.category.placeholder': 'Select status',
    'services.status.active': 'Active',
    'services.status.inactive': 'Inactive',
    'services.popular': 'Mark as popular',
    'services.form-action.cancel': 'Cancel',
    'services.form-action.update': 'Update Service',
    'services.form-action.create': 'Create Service',
    'services.edit-service': 'Edit Service',
    'services.create-service': 'Create New Service',
    'service.title': 'Service Catalog',
    'service.subtitle': 'Manage available service offerings',
    'service.available': 'Available Services',
    'service.add-new': 'Add New Service',
    'service.not_found': 'No services found. Add your first service!',
    'service.deleted': 'Service deleted',
    'service.description': 'The service has been successfully removed',
    'service.alert.title': 'Are you sure?',
    'service.alert.description': 'This action cannot be undone. This will permanently delete the service from the system.',
    'service.alert.cancel': 'Cancel',
    'service.alert.delete': 'Delete',
    'service.edit': 'Edit',
    'service.detail.title': 'Service Request Details',
    'service.detail.description': 'View and manage the details of this service request',
    'service.detail.client': 'Client:',
    'service.detail.service': 'Service:',
    'service.detail.date': 'Request Date:',
    'service.detail.status': 'Status:',
    'service.detail.last-update': 'Last Updated:',
    'service.detail.req-id': 'Request ID:',
    'service.detail.admin-notes': 'Admin Notes:',
    'service.detail.add-note.placeholder': 'Add internal notes about this request...',
    'service.detail.cancel': 'Cancel',
    'service.detail.save-notes': 'Save Notes',
    'service.requests.title': 'Service Requests',
    'service.requests.description': 'Oversee client service requests',
    'service.search': 'Search',
    'service.search.placeholder': 'Search by client or service name...',
    'service.status': 'Status',
    'service.status.filter': 'Filter by status',
    'service.status.all-status': 'All Status',
    'service.status.pending': 'Pending',
    'service.status.completed': 'Completed',
    'service.status.rejected': 'Rejected',
    'service.table.client': 'Client',
    'service.table.service': 'Service',
    'service.table.date': 'Date',
    'service.table.status': 'Status',
    'service.table.actions': 'Actions',
    'service.table.details': 'Details',
    'service.table.approve': 'Approve',
    'service.table.reject': 'Reject',
    'service.table.reset': 'Reset',
    'service.notes.toast.title': 'Notes saved',
    'service.notes.toast.description': 'Admin notes have been successfully saved.',
    'service.request.toast.title': 'Status updated',
    'service.request.toast.description': 'Request status has been updated',
    'service.request.auth-require.title': 'Authentication Required',
    'service.request.auth-require.description': 'Please login to request services.',
    'service.request.auth-failed.title': 'Request Failed',
    'service.request.auth-failed.description': 'There was a problem submitting your service request. Please try again.',
    'service.request.success.title': 'Service Requested',
    'service.request.success.description': 'Your request has been submitted. The admin has been notified.',

    // Statuses
    'status.completed': 'Completed',
    'status.pending': 'Pending',
    'status.rejected': 'Rejected',
    'status.unknown': 'Unknown',
    'status.available': 'Available',

    // Email settings
    'settings.title': 'Email Settings',
    'settings.description': 'Configure notification settings for different services',
    'settings.loading': 'Loading settings...',
    'settings.hr_payroll': 'HR & Payroll Notification Email',
    'settings.subscriptions': 'Subscriptions Notification Email',
    'settings.services': 'Additional Services Notification Email',
    'settings.save': 'Save',
    'settings.toast.success.title': 'Settings Updated',
    'settings.toast.success.description': 'Email notification settings have been saved successfully.',
    'settings.toast.failed.title': 'Update Failed',
    'settings.toast.failed.description': 'There was a problem updating the notification settings.',

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
  },
  
  es: {

  }
};

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && ['en', 'es'].includes(savedLang)) {
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
