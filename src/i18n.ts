
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      app: {
        title: "Business Advisory",
        login: "Log in",
        logout: "Log out",
        register: "Register",
        language: "Language"
      },
      nav: {
        dashboard: "Dashboard",
        invoices: "Invoices",
        sale_invoices: "Sale Invoices",
        sale_invoices: {
          create: "Upload Sale Invoice"
        },
        supplier_invoices: "Supplier Invoices",
        hr: "HR",
        hr: {
          new_employee: "New Employee",
          termination: "Termination",
          work_hours: "Work Hours"
        },
        contracts: "Contracts",
        documents: "Documents",
        reports: "Reports",
        profile: "Profile",
        additional_services: "Additional Services",
        subscriptions: "Subscriptions",
        users: "User Management",
        services: "Services",
        services: {
          add: "Add Service"
        }
      },
      admin: {
        dashboard: "Admin Dashboard",
        logs: "System Logs"
      },
      invoices: {
        title: "Sale Invoices",
        upload: "Upload",
        upload_title: "Upload Sale Invoice"
      }
    }
  },
  es: {
    translation: {
      app: {
        title: "Asesoría Empresarial",
        login: "Iniciar sesión",
        logout: "Cerrar sesión",
        register: "Registrarse",
        language: "Idioma"
      },
      nav: {
        dashboard: "Panel",
        invoices: "Facturas",
        sale_invoices: "Facturas de Venta",
        sale_invoices: {
          create: "Subir Factura de Venta"
        },
        supplier_invoices: "Facturas de Proveedor",
        hr: "RRHH",
        hr: {
          new_employee: "Nuevo Empleado",
          termination: "Terminación",
          work_hours: "Horas de Trabajo"
        },
        contracts: "Contratos",
        documents: "Documentos",
        reports: "Informes",
        profile: "Perfil",
        additional_services: "Servicios Adicionales",
        subscriptions: "Suscripciones",
        users: "Gestión de Usuarios",
        services: "Servicios",
        services: {
          add: "Añadir Servicio"
        }
      },
      admin: {
        dashboard: "Panel de Administración",
        logs: "Registros del Sistema"
      },
      invoices: {
        title: "Facturas de Venta",
        upload: "Subir",
        upload_title: "Subir Factura de Venta"
      }
    }
  },
  ru: {
    translation: {
      app: {
        title: "Бизнес-консультирование",
        login: "Войти",
        logout: "Выйти",
        register: "Регистрация",
        language: "Язык"
      },
      nav: {
        dashboard: "Панель управления",
        invoices: "Счета",
        sale_invoices: "Счета продаж",
        sale_invoices: {
          create: "Загрузить счет продажи"
        },
        supplier_invoices: "Счета поставщиков",
        hr: "HR",
        hr: {
          new_employee: "Новый сотрудник",
          termination: "Увольнение",
          work_hours: "Рабочее время"
        },
        contracts: "Контракты",
        documents: "Документы",
        reports: "Отчеты",
        profile: "Профиль",
        additional_services: "Дополнительные услуги",
        subscriptions: "Подписки",
        users: "Управление пользователями",
        services: "Услуги",
        services: {
          add: "Добавить услугу"
        }
      },
      admin: {
        dashboard: "Панель администратора",
        logs: "Системные журналы"
      },
      invoices: {
        title: "Счета продаж",
        upload: "Загрузить",
        upload_title: "Загрузить счет продажи"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
