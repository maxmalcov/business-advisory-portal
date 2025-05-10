import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

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

    // Regular
    pending: 'Pending',
    active: 'Active',
    inactive: 'Inactive',
    rejected: 'Rejected',
    close: 'Close',

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
    'hr.employee': 'Employee',
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

    'hr.index.title': 'HR & Payroll',
    'hr.index.description': 'Manage employees, work hours, and terminations',
    'hr.index.new-employee.description':
      'Start the onboarding process for new employees',
    'hr.index.new-employee.button': 'Go to New Employee',
    'hr.index.termination.description': 'Manage employee termination processes',
    'hr.index.termination.button': 'Go to Termination',
    'hr.index.work-hours.description':
      'Track and manage employee working hours',
    'hr.index.work-hours.button': 'Go to Work Hours',
    'hr.index.list.title': 'Employee List',
    'hr.index.search.placeholder': 'Search by name, position, or company...',
    'hr.index.table.all-employees': 'All Employees',
    'hr.index.table.active-employees': 'Active Employees',
    'hr.index.table.terminated-employees': 'Terminated Employees',
    'hr.index.table.full-name': 'Full Name',
    'hr.index.table.position': 'Position/Role',
    'hr.index.table.status': 'Status',
    'hr.index.table.start-date': 'Start Date',
    'hr.index.table.end-date': 'End Date',

    'hr.index.status.active': 'Active',
    'hr.index.status.terminated': 'Terminated',

    'hr.index.button.view-details': 'View details',
    'hr.index.employee.details.title': 'Employee Details',
    'hr.index.employee.edit.title': 'Edit Employee',
    'hr.index.employee.edit.button': 'Edit',
    'hr.index.employee.error-loading': 'Error Loading Data',
    'hr.index.employee.no-employee.title': 'No Data Available',
    'hr.index.employee.no-employee.description':
      'Employee information could not be loaded.',
    'hr.index.employee.details.basic-info.title': 'Basic Information',
    'hr.index.employee.details.basic-info.company': 'Company Name',
    'hr.index.employee.details.basic-info.status': 'Status',
    'hr.index.employee.details.basic-info.position': 'Position',
    'hr.index.employee.details.basic-info.email': 'Email',
    'hr.index.employee.details.dates.employment': 'Employment Dates',
    'hr.index.employee.details.dates.start': 'Start Date',
    'hr.index.employee.details.dates.end': 'End Date',
    'hr.index.employee.details.dates.current': 'Current Employee',
    'hr.index.employee.details.id': 'Identification',
    'hr.index.employee.details.id-document': 'ID Document',
    'hr.index.employee.details.no-document': 'No document provided',
    'hr.index.employee.details.financial': 'Financial Information',
    'hr.index.employee.details.financial.salary': 'Salary',
    'hr.index.employee.details.financial.salary.gross': '(Gross)',
    'hr.index.employee.details.financial.salary.net': '(Net)',
    'hr.index.employee.details.financial.salary.iban': 'IBAN',
    'hr.index.employee.details.financial.salary.social-number':
      'Social Security Number',
    'hr.index.employee.details.contact': 'Contact Information',
    'hr.index.employee.details.contact.address': 'Address',
    'hr.index.employee.details.contact.email': 'Email',
    'hr.index.employee.details.contact.not-found':
      'No contact information available',
    'hr.index.employee.schedule': 'Schedule',
    'hr.index.employee.schedule.weekly': 'Weekly Working Schedule',
    'hr.index.employee.schedule.not-found': 'No schedule information available',
    'hr.index.employee.comments': 'Comments',
    'hr.index.employee.comments.not-found': 'No comments available',
    'hr.index.employee.detail-from.basic-info': 'Basic Information',
    'hr.index.employee.detail-from.full-name': 'Full name',
    'hr.index.employee.detail-from.position': 'Position/Role',
    'hr.index.employee.detail-from.company': 'Company Name',
    'hr.index.employee.detail-from.status': 'Status',
    'hr.index.employee.detail-from.id': 'Identification',
    'hr.index.employee.detail-from.id.dni': 'DNI/TIE',
    'hr.index.employee.detail-from.id.title': 'ID Document',
    'hr.index.employee.detail-from.id.view': 'View',
    'hr.index.employee.detail-from.id.download': 'Download',
    'hr.index.employee.detail-from.date': 'Employment Dates',
    'hr.index.employee.detail-from.date.start': 'Start Date',
    'hr.index.employee.detail-from.date.end': 'End Date',
    'hr.index.employee.detail-from.schedule': 'Schedule',
    'hr.index.employee.detail-from.weekly': 'Weekly Working Schedule',
    'hr.index.employee.detail-from.weekly.span':
      'Please enter the full weekly schedule',
    'hr.index.employee.detail-from.schedule.placeholder':
      'E.g., Monday-Friday: 9:00-17:00, Saturday: 9:00-13:00',
    'hr.index.employee.detail-from.schedule.examples': 'Examples:',
    'hr.index.employee.detail-from.schedule.examples.1':
      'Monday-Friday: 9:00-17:00',
    'hr.index.employee.detail-from.schedule.examples.2':
      'Mon, Wed, Fri: 8:00-15:00 / Tue, Thu: 12:00-20:00',
    'hr.index.employee.detail-from.schedule.examples.3': '',
    'hr.index.employee.detail-from.button.cancel': 'Cancel',
    'hr.index.employee.detail-from.button.saving': 'Saving...',
    'hr.index.employee.detail-from.button.save': 'Save Changes',

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
    'useful-links.error-loading':
      'Error loading resources. Please try again later.',
    'useful-links.table.all': 'All',
    'useful-links.table.social-security': 'Social Security',
    'useful-links.table.no-resources': 'No resources match your search.',
    'useful-links.table.no-available-resources': 'No resources available yet.',
    'useful-links.table.open-link': 'Open link',
    'useful-links.title': 'Useful Links',
    'useful-links.description':
      'Manage and organize useful links for platform users',
    'useful-links.user.description':
      'Access important websites and resources you might need for your business operations.',
    'useful-links.add-link': 'Add New Link',
    'useful-links.no-links-available':
      'No links available. Click "Add New Link" to create your first resource.',
    'useful-links.table.title': 'Title',
    'useful-links.table.category': 'Category',
    'useful-links.table.icon': 'Icon',
    'useful-links.table.order': 'Display Order',
    'useful-links.table.actions': 'Actions',
    'useful-links.dialog.description':
      'Add a useful link that will be displayed on the Useful Links page.',
    'useful-links.dialog.add-new.title': 'Add New Link',
    'useful-links.dialog.update.title': 'Update Link',
    'useful-links.dialog.add.title': 'Add Link',
    'useful-links.dialog.form.title': 'Title',
    'useful-links.dialog.form.description': 'Description',
    'useful-links.dialog.form.description.brief':
      'A brief description of what this link provides.',
    'useful-links.dialog.form.category': 'Category',
    'useful-links.dialog.form.category.placeholder': 'Select a category',
    'useful-links.dialog.form.icon': 'Icon',
    'useful-links.dialog.form.icon.placeholder': 'Select an icon',
    'useful-links.dialog.form.icon.description':
      'Choose an icon that best represents this resource.',
    'useful-links.dialog.form.display-order': 'Display Order',
    'useful-links.dialog.form.display-order.description':
      'Lower numbers will appear first in the list.',
    Taxes: 'Taxes',
    Legal: 'Legal',
    'Social Security': 'Social Security',
    Employment: 'Employment',
    Business: 'Business',
    Banking: 'Banking',
    Health: 'Health',
    Education: 'Education',
    General: 'General',
    Building: 'Building',
    Shield: 'Shield',
    Briefcase: 'Briefcase',
    Users: 'Users',
    Document: 'Document',
    Website: 'Website',
    Phone: 'Phone',
    Email: 'Email',
    Calendar: 'Calendar',
    Payment: 'Payment',
    Book: 'Book',
    Location: 'Location',
    Government: 'Government',
    Help: 'Help',
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
    'services.additional_services.desc':
      'Explore our premium services designed to help your business thrive',
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
    'service.alert.description':
      'This action cannot be undone. This will permanently delete the service from the system.',
    'service.alert.cancel': 'Cancel',
    'service.alert.delete': 'Delete',
    'service.edit': 'Edit',
    'service.detail.title': 'Service Request Details',
    'service.detail.description':
      'View and manage the details of this service request',
    'service.detail.client': 'Client:',
    'service.detail.service': 'Service:',
    'service.detail.date': 'Request Date:',
    'service.detail.status': 'Status:',
    'service.detail.last-update': 'Last Updated:',
    'service.detail.req-id': 'Request ID:',
    'service.detail.admin-notes': 'Admin Notes:',
    'service.detail.add-note.placeholder':
      'Add internal notes about this request...',
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
    'service.notes.toast.description':
      'Admin notes have been successfully saved.',
    'service.request.toast.title': 'Status updated',
    'service.request.toast.description': 'Request status has been updated',
    'service.request.auth-require.title': 'Authentication Required',
    'service.request.auth-require.description':
      'Please login to request services.',
    'service.request.auth-failed.title': 'Request Failed',
    'service.request.auth-failed.description':
      'There was a problem submitting your service request. Please try again.',
    'service.request.success.title': 'Service Requested',
    'service.request.success.description':
      'Your request has been submitted. The admin has been notified.',
    'service.request.not-found': 'No service requests found.',
    'service.request.loading': 'Loading requests...',

    // Statuses
    'status.completed': 'Completed',
    'status.pending': 'Pending',
    'status.rejected': 'Rejected',
    'status.unknown': 'Unknown',
    'status.available': 'Available',

    // Email settings
    'settings.title': 'Email Settings',
    'settings.description':
      'Configure notification settings for different services',
    'settings.loading': 'Loading settings...',
    'settings.hr_payroll': 'HR & Payroll Notification Email',
    'settings.subscriptions': 'Subscriptions Notification Email',
    'settings.services': 'Additional Services Notification Email',
    'settings.save': 'Save',
    'settings.toast.success.title': 'Settings Updated',
    'settings.toast.success.description':
      'Email notification settings have been saved successfully.',
    'settings.toast.failed.title': 'Update Failed',
    'settings.toast.failed.description':
      'There was a problem updating the notification settings.',

    // Subscriptions
    subscription: 'Subscription',
    'subscriptions.title': 'Available Subscriptions',
    'subscriptions.request': 'Request Service',
    'subscriptions.demo': 'Watch Demo',
    'subscriptions.iframe1': 'IFRAME 1',
    'subscriptions.iframe2': 'IFRAME 2',
    'subscriptions.crm': 'CRM',
    'subscriptions.timetracking': 'Time Tracking',
    'subscriptions.admin.table.title': 'Available Subscription Types',
    'subscriptions.admin.add-new': 'Add New Subscription Type',
    'subscriptions.admin.title': 'Subscription Catalog',
    'subscriptions.admin.description': 'Manage available subscription types',
    'subscriptions.admin.no-subscriptions':
      'No subscription types found. Add your first subscription type!',
    'subscriptions.admin.toast.error': 'Error',
    'subscriptions.admin.toast.error.description':
      'Failed to create subscription type.',
    'subscriptions.admin.toast.error-edit.description':
      'Failed to edit subscription type.',
    'subscriptions.admin.edit-type': 'Edit Subscription Type',
    'subscriptions.admin.edit-button': 'Edit Subscription Type',
    'subscriptions.admin.add-new-type': 'Add New Subscription Type',
    'subscriptions.admin.creating': 'Creating...',
    'subscriptions.admin.creating.type': 'Create Subscription Type',
    'subscriptions.admin.table.name': 'Name',
    'subscriptions.admin.table.description': 'Description',
    'subscriptions.admin.table.id': 'Type ID (Slug)',
    'subscriptions.admin.table.icon-type': 'Icon Type',
    'subscriptions.admin.table.status': 'Status',
    'subscriptions.admin.table.created': 'Created',
    'subscriptions.admin.table.actions': 'Actions',
    'subscriptions.admin.table.edit': 'Edit',
    'subscriptions.admin.created': 'Subscription Type Created',
    'subscriptions.admin.created.description':
      'Successfully created subscription type.',
    'subscriptions.admin.created-edit': 'Subscription Type Edited',
    'subscriptions.admin.created.description-edit':
      'Successfully edited subscription type.',
    'subscriptions.admin.delete.toast.title': 'Subscription type deleted',
    'subscriptions.admin.delete.toast.description':
      'The subscription type has been successfully removed',
    'subscriptions.admin.form.name': 'Name',
    'subscriptions.admin.form.name.placeholder': 'Time Tracking',
    'subscriptions.admin.form.name.help':
      'Display name for this subscription type',
    'subscriptions.admin.form.description': 'Description',
    'subscriptions.admin.form.description.placeholder':
      'Track and manage your work hours',
    'subscriptions.admin.form.description.help':
      'A brief description of what this subscription provides',
    'subscriptions.admin.form.type': 'Type (Slug)',
    'subscriptions.admin.form.type.placeholder': 'timetracking',
    'subscriptions.admin.form.type.help':
      'Internal identifier (lowercase letters, numbers, and hyphens only)',
    'subscriptions.admin.form.icon.description':
      'Choose an icon to represent this subscription type',
    'subscriptions.admin.form.icon.label.web-app': 'Web App',
    'subscriptions.admin.form.icon.label.calendar': 'Calendar',
    'subscriptions.admin.form.icon.label.crm': 'CRM',
    'subscriptions.admin.form.icon.label.timetracking': 'Time Tracking',
    'subscriptions.admin.remove.button.cancel': 'Cancel',
    'subscriptions.admin.remove.button.delete': 'Delete',
    'subscriptions.admin.remove.areyousure': 'Are you sure?',
    'subscriptions.admin.remove.warning':
      'This action cannot be undone. This will permanently delete this subscription type\n' +
      'and may affect users who have active subscriptions of this type.',
    'subscriptions.requests.not-found': 'No subscription requests found.',
    'subscriptions.requests.card.title': 'Subscription Requests',
    'subscriptions.requests.title': 'Subscription Requests',
    'subscriptions.requests.subtitle': 'Manage user subscription requests',
    'subscriptions.requests.description':
      'Manage access requests and active client subscriptions',
    'subscriptions.requests.toast.success.title': 'Access Requested',
    'subscriptions.requests.toast.success.description':
      'Your request has been sent to the administrator.',
    'subscriptions.requests.toast.failed.title': 'Request Failed',
    'subscriptions.requests.toast.failed.description':
      'There was a problem submitting your request. Please try again.',
    'subscriptions.dialog.confirm-submit.title': 'Request Access to ',
    'subscriptions.dialog.confirm-submit.description':
      'This will send a notification to the administrator to review your request.\n' +
      '            You will be notified once your request has been processed.',
    'subscriptions.dialog.confirm-submit.button': 'Submit Request',
    'subscriptions.dialog.confirm-submit.cancel': 'Cancel',
    'subscription.iframe.required.title': 'Subscription Required',
    'subscription.iframe.required.pending':
      'Your access request is pending approval.',
    'subscription.iframe.required.rejected':
      'Your access request has been rejected. Please contact support for more information.',
    'subscription.iframe.required.inactive':
      'You need to subscribe to access this tool.',
    'subscription.iframe.request-access.button': 'Request Access',
    'subscription.admin.message.description.active':
      'Subscription activated successfully',
    'subscription.admin.message.description.inactive':
      'Subscription stopped successfully',
    'subscription.admin.message.description.reject':
      'Subscription rejected successfully',
    'subscription.admin.message.description.pending':
      'Subscription status updated to pending',
    'subscription.admin.message.title': 'Status Updated',
    'subscription.admin.error': 'Error',
    'subscription.admin.error.description':
      'Failed to update subscription status. Please try again.',
    'subscription.admin.form.date': 'Pick a date',
    'subscription.admin.form.date-start': 'Start Date',
    'subscription.admin.form.date-end': 'End Date (Optional)',
    'subscription.admin.form.date-no': 'No end date (unlimited)',
    'subscription.admin.assign-new': 'Assign a New Subscription',
    'subscription.admin.assign-new.button': 'Assign Subscription',
    'subscription.admin.toast.success.title': 'Success',
    'subscription.admin.toast.success.description':
      'Subscription has been assigned successfully',
    'subscription.admin.toast.failed.title': 'Error',
    'subscription.admin.toast.failed.description':
      'Failed to assign subscription. Please try again.',
    'subscription.admin.buttons.stop': 'Stop',
    'subscription.admin.buttons.stop.prompt':
      'Stop this subscription and disable access',
    'subscription.admin.buttons.edit': 'Edit',
    'subscription.admin.buttons.edit.prompt': 'Edit subscription details',
    'subscription.admin.buttons.approve': 'Approve',
    'subscription.admin.buttons.approve.prompt':
      'Approve this subscription request',
    'subscription.admin.buttons.reject': 'Reject',
    'subscription.admin.buttons.reject.prompt':
      'Reject this subscription request',
    'subscription.admin.table.name': 'Name',
    'subscription.admin.table.type': 'Type',
    'subscription.admin.table.user': 'User',
    'subscription.admin.table.status': 'Status',
    'subscription.admin.table.actions': 'Actions',

    // Common pages
    'page.under_construction': 'This page is under construction',

    // Contracts & Documents
    'contracts.title': 'Contracts Management',
    'contracts.description': 'View and manage your business contracts',
    'documents.title': 'Document Management',
    'documents.description': 'Access and manage your important documents',

    // Reports
    'reports.title': 'Reports & Analytics',
    'reports.description':
      'View detailed reports about your business activities',

    // Logs
    'logs.history.title': 'System Log History',
    'logs.history.description':
      'Track and monitor all system activities and events',

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

    'invoices.toast.no-files.title': 'No files processed',
    'invoices.toast.no-files.description':
      'Please wait for files to finish uploading.',
    'invoices.toast.email-error.title': 'Email Failed',
    'invoices.toast.email-error.description':
      'An error occurred while sending the email.',
    'invoices.toast.file-limit.title': 'File limit reached',
    'invoices.toast.file-limit.description':
      'You can upload a maximum of 15 files.',
    'invoices.sale.title': 'Upload and manage your sales invoices',
    'invoices.type.sale': 'sale',
    'invoices.type.supplier': 'supplier',
    'invoices.guidelines.maxsize': 'Maximum file size: |MB per file',
    'invoices.guidelines.maxfiles': 'Maximum | files at once',
    'invoices.guidelines.accepted-formats': 'Accepted formats: |',
    'invoices.guidelines.email-to': 'Email notifications will be sent to: |',
    'invoices.guidelines.email-warning':
      'Warning: No | invoice email configured in your profile',
    'invoices.drop-area.title': 'Drop your files here',
    'invoices.drop-area.click': 'or click to browse from your computer',
    'invoices.drop-area.select-files': 'Select Files',
    'invoices.supplier.title': 'Upload and manage your supplier invoices',
    'invoices.history.title': 'Invoice History',
    'invoices.history.description': 'View and manage all your invoice records',
    'invoices.search.placeholder': 'Search invoices...',
    'invoices.search.all': 'All',
    'invoices.search.sales': 'Sales',
    'invoices.search.supplier': 'Supplier',
    'invoices.search.table.file-name': 'File Name',
    'invoices.search.table.type': 'Type',
    'invoices.search.table.upload-date': 'Upload Date',
    'invoices.search.table.actions': 'Actions',
    'invoices.search.table.mobile.date': 'Date:',
    'invoices.search.table.mobile.type': 'Type:',
    'invoices.search.table.mobile.download': 'Download',
    'invoices.search.table.mobile.view': 'View',

    'toast.admin.new-user.title': 'Conflict',
    'toast.admin.new-user.description': 'User already exists',
  },

  es: {},
};

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
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
