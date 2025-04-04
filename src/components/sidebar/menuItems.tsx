
import { useLanguage } from '@/context/LanguageContext';
import {
  BarChart3,
  FileText,
  FileUp,
  FileDown,
  Users,
  UserCog,
  Briefcase,
  FileIcon,
  ScrollText,
  PackageIcon,
  Layers,
  LayoutGrid,
  Activity,
} from 'lucide-react';
import { SidebarItem } from './types';

export const useMenuItems = () => {
  const { t } = useLanguage();
  
  const clientMenuItems: SidebarItem[] = [
    {
      name: t('nav.dashboard'),
      path: '/dashboard',
      icon: LayoutGrid,
    },
    {
      name: t('nav.invoices'),
      path: '/invoices',
      icon: FileUp,
      children: [
        {
          name: t('nav.invoices.create'),
          path: '/invoices/create',
          icon: FileText,
        },
      ],
    },
    {
      name: t('nav.supplier_invoices'),
      path: '/supplier-invoices',
      icon: FileDown,
    },
    {
      name: t('nav.hr'),
      path: '/hr',
      icon: Users,
      children: [
        {
          name: t('nav.hr.new_employee'),
          path: '/hr/new-employee',
          icon: Users,
        },
        {
          name: t('nav.hr.termination'),
          path: '/hr/termination',
          icon: Users,
        },
        {
          name: t('nav.hr.work_hours'),
          path: '/hr/work-hours',
          icon: Users,
        },
      ],
    },
    {
      name: t('nav.contracts'),
      path: '/contracts',
      icon: Briefcase,
    },
    {
      name: t('nav.documents'),
      path: '/documents',
      icon: FileIcon,
    },
    {
      name: t('nav.reports'),
      path: '/reports',
      icon: ScrollText,
    },
    {
      name: t('nav.profile'),
      path: '/profile',
      icon: UserCog,
    },
    {
      name: t('nav.additional_services'),
      path: '/services',
      icon: PackageIcon,
    },
    {
      name: t('nav.subscriptions'),
      path: '/subscriptions',
      icon: Layers,
    },
  ];

  const adminMenuItems: SidebarItem[] = [
    {
      name: t('admin.dashboard'),
      path: '/admin',
      icon: LayoutGrid,
    },
    {
      name: t('nav.reports'),
      path: '/admin/reports',
      icon: BarChart3,
    },
    {
      name: t('nav.profile'),
      path: '/profile',
      icon: UserCog,
    },
    {
      name: t('nav.services'),
      path: '/admin/services',
      icon: PackageIcon,
    },
    {
      name: t('nav.subscriptions'),
      path: '/admin/subscriptions',
      icon: Layers,
    },
    {
      name: t('nav.users'),
      path: '/admin/users',
      icon: Users,
    },
    {
      name: t('admin.logs'),
      path: '/admin/logs',
      icon: Activity,
    },
  ];
  
  return { clientMenuItems, adminMenuItems };
};
