import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
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
  Mail,
  Settings,
  Inbox,
  Wrench,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import SidebarHeader from './sidebar/SidebarHeader';
import SidebarNav from './sidebar/SidebarNav';
import { SidebarItem, SidebarProps } from './sidebar/types';
import { useNotificationCounts } from '@/hooks/use-notification-counts';
import { NotificationBadge } from './ui/notification-badge';

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { pendingServices, pendingSubscriptions } = useNotificationCounts();

  const isAdmin = user?.userType === 'admin';

  const clientMenuItems: SidebarItem[] = [
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
      name: t('nav.useful-links'),
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

  const adminMenuItems: SidebarItem[] = [
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
      name: t('admin.subscriptions'),
      path: '/admin/subscription-requests',
      icon: Layers,
      hasPendingChildren: pendingSubscriptions > 0,
      children: [
        {
          name: t('admin.subscriptions.requests'),
          path: '/admin/subscription-requests',
          icon: Inbox,
          badge: pendingSubscriptions,
        },
        {
          name: t('admin.subscriptions.catalog'),
          path: '/admin/subscription-catalog',
          icon: BookOpen,
        },
      ],
    },
    {
      name: t('admin.useful-links'),
      path: '/admin/useful-links',
      icon: Link2,
    },
    {
      name: t('admin.logs'),
      path: '/admin/logs',
      icon: Activity,
    },
    {
      name: t('admin.service'),
      path: '/admin/service-requests',
      icon: Settings,
      hasPendingChildren: pendingServices > 0,
      children: [
        {
          name: t('admin.service.requests'),
          path: '/admin/service-requests',
          icon: Inbox,
          badge: pendingServices,
        },
        {
          name: t('admin.service.catalog'),
          path: '/admin/service-catalog',
          icon: Wrench,
        },
      ],
    },
    {
      name: t('admin.email-settings'),
      path: '/admin/settings/notifications',
      icon: Mail,
    },
  ];

  const menuItems = isAdmin ? adminMenuItems : clientMenuItems;

  return (
    <aside
      className={cn(
        'bg-sidebar text-sidebar-foreground w-64 min-h-screen overflow-y-auto fixed top-0 left-0 z-40 pt-4 transition-transform duration-300 ease-in-out',
        isOpen
          ? 'translate-x-0'
          : isMobile
            ? '-translate-x-full'
            : 'translate-x-0',
        isMobile && 'shadow-lg',
      )}
    >
      <SidebarHeader onClose={onClose} />
      <SidebarNav menuItems={menuItems} onClose={onClose} />
    </aside>
  );
};

export default Sidebar;
