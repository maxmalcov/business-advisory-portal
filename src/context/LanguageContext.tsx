
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
    'nav.invoices': 'Invoices',
    'nav.invoices.create': 'Create New',
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
    'invoices.title': 'Invoices',
    'invoices.upload': 'Upload Invoice',
    'invoices.history': 'Upload History',
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
  },
  
  es: {
    // Common
    'app.title': 'Portal Business Advisory',
    'app.login': 'Iniciar sesión',
    'app.logout': 'Cerrar sesión',
    'app.register': 'Registrarse',
    'app.welcome': 'Bienvenido a Business Advisory',
    'app.error': 'Ha ocurrido un error',
    'app.loading': 'Cargando...',
    'app.save': 'Guardar',
    'app.cancel': 'Cancelar',
    'app.submit': 'Enviar',
    'app.back': 'Atrás',
    'app.next': 'Siguiente',
    'app.close': 'Cerrar',
    'app.search': 'Buscar',
    'app.add': 'Añadir',
    'app.edit': 'Editar',
    'app.delete': 'Eliminar',
    'app.language': 'Idioma',
    'app.success': 'Éxito',
    'app.warning': 'Advertencia',
    'app.info': 'Información',
    
    // Navigation
    'nav.dashboard': 'Panel de control',
    'nav.invoices': 'Facturas',
    'nav.invoices.create': 'Crear nueva',
    'nav.supplier_invoices': 'Facturas de proveedores',
    'nav.hr': 'RRHH & Nóminas',
    'nav.hr.new_employee': 'Nuevo empleado',
    'nav.hr.termination': 'Terminación de empleado',
    'nav.hr.work_hours': 'Horas de trabajo',
    'nav.contracts': 'Contratos',
    'nav.documents': 'Documentos',
    'nav.reports': 'Informes',
    'nav.profile': 'Mi perfil',
    'nav.services': 'Gestión de servicios',
    'nav.users': 'Gestión de usuarios',
    'nav.additional_services': 'Servicios adicionales',
    'nav.subscriptions': 'Suscripciones',
    
    // Auth
    'auth.email': 'Correo electrónico',
    'auth.password': 'Contraseña',
    'auth.forgot_password': '¿Olvidaste la contraseña?',
    'auth.login_success': 'Sesión iniciada correctamente',
    'auth.logout_success': 'Sesión cerrada correctamente',
    'auth.register_success': 'Registro completado correctamente',
    
    // Dashboard
    'dashboard.welcome': 'Bienvenido a su panel de control',
    'dashboard.recent_activity': 'Actividad reciente',
    'dashboard.stats': 'Estadísticas',
    'dashboard.quick_actions': 'Acciones rápidas',
    
    // Invoices
    'invoices.title': 'Facturas',
    'invoices.upload': 'Subir factura',
    'invoices.history': 'Historial de subidas',
    'invoices.date': 'Fecha',
    'invoices.amount': 'Importe',
    'invoices.client': 'Cliente',
    'invoices.status': 'Estado',
    'invoices.upload_success': 'Facturas subidas correctamente',
    'invoices.max_size': 'Tamaño máximo por archivo: 25MB',
    'invoices.max_files': 'Suba hasta 15 archivos a la vez',
    'invoices.allowed_types': 'Tipos de archivo permitidos: PDF o JPG',
    
    // Supplier Invoices
    'supplier_invoices.title': 'Facturas de proveedores',
    
    // HR & Payroll
    'hr.new_employee.title': 'Contratación de nuevo empleado',
    'hr.new_employee.company': 'Nombre de la empresa',
    'hr.new_employee.dni': 'DNI o TIE del empleado',
    'hr.new_employee.start_date': 'Fecha de inicio',
    'hr.new_employee.schedule': 'Horario semanal de trabajo',
    'hr.new_employee.days_off': 'El empleado debe tener dos días consecutivos de descanso',
    'hr.new_employee.position': 'Puesto de trabajo',
    'hr.new_employee.ss_number': 'Número de Seguridad Social',
    'hr.new_employee.salary': 'Salario mensual',
    'hr.new_employee.iban': 'IBAN',
    'hr.new_employee.address': 'Dirección completa',
    'hr.new_employee.email': 'Correo electrónico del empleado',
    'hr.new_employee.comments': 'Comentarios adicionales',
    
    'hr.termination.title': 'Terminación de empleado',
    'hr.termination.employee': 'Nombre del empleado',
    'hr.termination.date': 'Fecha de terminación',
    'hr.termination.vacation': 'Días de vacaciones utilizados',
    'hr.termination.reason': 'Motivo de la terminación',
    
    'hr.work_hours.title': 'Horas de trabajo mensuales',
    'hr.work_hours.salary': 'Salario bruto mensual',
    'hr.work_hours.notes': 'Notas',
    'hr.work_hours.absence': 'Días de ausencia',
    'hr.work_hours.medical': 'Fecha de baja médica',
    
    // Registration
    'registration.title': 'Registrar cuenta',
    'registration.language': 'Idioma preferido',
    'registration.type': 'Tipo de cuenta',
    'registration.type.freelancer': 'Autónomo',
    'registration.type.sl': 'Sociedad Limitada (SL)',
    'registration.type.sa': 'Sociedad Anónima (SA)',
    'registration.type.individual': 'Particular',
    'registration.name': 'Nombre completo',
    'registration.company': 'Nombre de la empresa',
    'registration.admin_name': 'Nombre del administrador',
    'registration.nif': 'NIF',
    'registration.address': 'Dirección',
    'registration.postal': 'Código postal',
    'registration.city': 'Ciudad',
    'registration.province': 'Provincia',
    'registration.country': 'País',
    'registration.email': 'Correo electrónico',
    'registration.phone': 'Teléfono',
    
    // Admin
    'admin.dashboard': 'Panel de administración',
    'admin.logs': 'Historial de registros',
    'admin.manage_users': 'Gestionar usuarios',
    'admin.manage_services': 'Gestionar servicios',
    'admin.statistics': 'Estadísticas',
    
    // Services
    'services.request': 'Solicitar servicio',
    'services.status.requested': 'Solicitado',
    'services.status.pending': 'Pendiente',
    'services.status.completed': 'Completado',
    'services.status.rejected': 'Rechazado',
    
    // Subscriptions
    'subscriptions.title': 'Suscripciones disponibles',
    'subscriptions.request': 'Solicitar servicio',
    'subscriptions.demo': 'Ver demo',
    'subscriptions.iframe1': 'IFRAME 1',
    'subscriptions.iframe2': 'IFRAME 2',
    'subscriptions.crm': 'CRM',
    'subscriptions.timetracking': 'Control de tiempo',
  },
  
  ru: {
    // Common
    'app.title': 'Портал Business Advisory',
    'app.login': 'Войти',
    'app.logout': 'Выйти',
    'app.register': 'Регистрация',
    'app.welcome': 'Добро пожаловать в Business Advisory',
    'app.error': 'Произошла ошибка',
    'app.loading': 'Загрузка...',
    'app.save': 'Сохранить',
    'app.cancel': 'Отмена',
    'app.submit': 'Отправить',
    'app.back': 'Назад',
    'app.next': 'Далее',
    'app.close': 'Закрыть',
    'app.search': 'Поиск',
    'app.add': 'Добавить',
    'app.edit': 'Редактировать',
    'app.delete': 'Удалить',
    'app.language': 'Язык',
    'app.success': 'Успех',
    'app.warning': 'Предупреждение',
    'app.info': 'Информация',
    
    // Navigation
    'nav.dashboard': 'Панель управления',
    'nav.invoices': 'Счета',
    'nav.invoices.create': 'Создать новый',
    'nav.supplier_invoices': 'Счета поставщиков',
    'nav.hr': 'HR и зарплата',
    'nav.hr.new_employee': 'Новый сотрудник',
    'nav.hr.termination': 'Увольнение',
    'nav.hr.work_hours': 'Рабочие часы',
    'nav.contracts': 'Контракты',
    'nav.documents': 'Документы',
    'nav.reports': 'Отчеты',
    'nav.profile': 'Мой профиль',
    'nav.services': 'Управление услугами',
    'nav.users': 'Управление пользователями',
    'nav.additional_services': 'Дополнительные услуги',
    'nav.subscriptions': 'Подписки',
    
    // Auth
    'auth.email': 'Электронная почта',
    'auth.password': 'Пароль',
    'auth.forgot_password': 'Забыли пароль?',
    'auth.login_success': 'Вход выполнен успешно',
    'auth.logout_success': 'Выход выполнен успешно',
    'auth.register_success': 'Регистрация выполнена успешно',
    
    // Dashboard
    'dashboard.welcome': 'Добро пожаловать в вашу панель управления',
    'dashboard.recent_activity': 'Недавняя активность',
    'dashboard.stats': 'Статистика',
    'dashboard.quick_actions': 'Быстрые действия',
    
    // Invoices
    'invoices.title': 'Счета',
    'invoices.upload': 'Загрузить счет',
    'invoices.history': 'История загрузок',
    'invoices.date': 'Дата',
    'invoices.amount': 'Сумма',
    'invoices.client': 'Клиент',
    'invoices.status': 'Статус',
    'invoices.upload_success': 'Счета успешно загружены',
    'invoices.max_size': 'Максимальный размер файла для загрузки: 25MB',
    'invoices.max_files': 'Загрузка до 15 файлов за раз',
    'invoices.allowed_types': 'Допустимые типы файлов: PDF или JPG',
    
    // Supplier Invoices
    'supplier_invoices.title': 'Счета поставщиков',
    
    // HR & Payroll
    'hr.new_employee.title': 'Наём нового сотрудника',
    'hr.new_employee.company': 'Название компании',
    'hr.new_employee.dni': 'DNI или TIE сотрудника',
    'hr.new_employee.start_date': 'Дата начала',
    'hr.new_employee.schedule': 'Еженедельный график работы',
    'hr.new_employee.days_off': 'У сотрудника должно быть два последовательных выходных дня',
    'hr.new_employee.position': 'Должность',
    'hr.new_employee.ss_number': 'Номер социального страхования',
    'hr.new_employee.salary': 'Ежемесячная зарплата',
    'hr.new_employee.iban': 'IBAN',
    'hr.new_employee.address': 'Полный адрес',
    'hr.new_employee.email': 'Электронная почта сотрудника',
    'hr.new_employee.comments': 'Дополнительные комментарии',
    
    'hr.termination.title': 'Увольнение сотрудника',
    'hr.termination.employee': 'Имя сотрудника',
    'hr.termination.date': 'Дата увольнения',
    'hr.termination.vacation': 'Использованные дни отпуска',
    'hr.termination.reason': 'Причина увольнения',
    
    'hr.work_hours.title': 'Ежемесячные рабочие часы',
    'hr.work_hours.salary': 'Ежемесячная брутто-зарплата',
    'hr.work_hours.notes': 'Примечания',
    'hr.work_hours.absence': 'Дни отсутствия',
    'hr.work_hours.medical': 'Дата медицинского отпуска',
    
    // Registration
    'registration.title': 'Регистрация аккаунта',
    'registration.language': 'Предпочитаемый язык',
    'registration.type': 'Тип аккаунта',
    'registration.type.freelancer': 'Фрилансер / ИП',
    'registration.type.sl': 'ООО (SL)',
    'registration.type.sa': 'АО (SA)',
    'registration.type.individual': 'Частное лицо',
    'registration.name': 'Полное имя',
    'registration.company': 'Название компании',
    'registration.admin_name': 'Имя администратора',
    'registration.nif': 'NIF (налоговый номер)',
    'registration.address': 'Адрес',
    'registration.postal': 'Почтовый индекс',
    'registration.city': 'Город',
    'registration.province': 'Область',
    'registration.country': 'Страна',
    'registration.email': 'Электронная почта',
    'registration.phone': 'Телефон',
    
    // Admin
    'admin.dashboard': 'Панель администратора',
    'admin.logs': 'История логов',
    'admin.manage_users': 'Управление пользователями',
    'admin.manage_services': 'Управление услугами',
    'admin.statistics': 'Статистика',
    
    // Services
    'services.request': 'Запросить услугу',
    'services.status.requested': 'Запрошено',
    'services.status.pending': 'В ожидании',
    'services.status.completed': 'Завершено',
    'services.status.rejected': 'Отклонено',
    
    // Subscriptions
    'subscriptions.title': 'Доступные подписки',
    'subscriptions.request': 'Запросить услугу',
    'subscriptions.demo': 'Смотреть демо',
    'subscriptions.iframe1': 'IFRAME 1',
    'subscriptions.iframe2': 'IFRAME 2',
    'subscriptions.crm': 'CRM',
    'subscriptions.timetracking': 'Учет времени',
  }
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
