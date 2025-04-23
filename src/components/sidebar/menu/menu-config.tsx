
import { 
  LayoutGrid,
  Users,
  FileUp,
  FileDown,
  UserPlus,
  UserMinus,
  Clock,
  Link2,
  Sparkles,
  Layers,
  BarChart3,
  Activity,
  FileText,
  History,
} from 'lucide-react';
import { MenuItem } from './types';

export const createClientMenuItems = (t: (key: string) => string): MenuItem[] => [
  {
    name: t('nav.dashboard'),
    path: '/dashboard',
    icon: LayoutGrid,
  },
  {
    name: t('nav.invoices'),
    path: '/invoices',
    icon: FileText,
    children: [
      {
        name: t('nav.sale_invoices'),
        path: '/invoices',
        icon: FileUp,
      },
      {
        name: t('nav.supplier_invoices'),
        path: '/supplier-invoices',
        icon: FileDown,
      },
      {
        name: t('invoices.history'),
        path: '/invoice-history',
        icon: History,
      },
    ],
  },
  {
    name: t('nav.hr'),
    path: '/hr',
    icon: Users,
    children: [
      {
        name: t('nav.hr.new_employee'),
        path: '/hr/new-employee',
        icon: UserPlus,
      },
      {
        name: t('nav.hr.termination'),
        path: '/hr/termination',
        icon: UserMinus,
      },
      {
        name: t('nav.hr.work_hours'),
        path: '/hr/work-hours',
        icon: Clock,
      },
    ],
  },
  {
    name: t('nav.subscriptions'),
    path: '/subscriptions',
    icon: Layers,
  },
  {
    name: 'Useful Links',
    path: '/useful-links',
    icon: Link2,
  },
  {
    name: t('nav.additional_services'),
    path: '/services',
    icon: Sparkles,
    highlight: true,
    tooltip: 'Explore available services for your company',
  },
];

export const createAdminMenuItems = (t: (key: string) => string): MenuItem[] => [
  {
    name: t('admin.dashboard'),
    path: '/admin',
    icon: LayoutGrid,
  },
  {
    name: t('nav.users'),
    path: '/admin/users',
    icon: Users,
  },
  {
    name: t('nav.reports'),
    path: '/admin/reports',
    icon: BarChart3,
  },
  {
    name: t('nav.subscriptions'),
    path: '/admin/subscriptions',
    icon: Layers,
  },
  {
    name: 'Useful Links',
    path: '/admin/useful-links',
    icon: Link2,
  },
  {
    name: t('admin.logs'),
    path: '/admin/logs',
    icon: Activity,
  },
  {
    name: t('nav.services'),
    path: '/admin/services',
    icon: Sparkles,
    highlight: true,
    tooltip: 'Manage and configure client services',
  },
];

