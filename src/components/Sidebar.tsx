
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
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
  UserPlus,
  UserMinus,
  Clock,
  Link2,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import SidebarHeader from './sidebar/SidebarHeader';
import SidebarNav from './sidebar/SidebarNav';
import { SidebarItem, SidebarProps } from './sidebar/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  const isAdmin = user?.userType === 'admin';
  
  const clientMenuItems: SidebarItem[] = [
    {
      name: t('nav.dashboard'),
      path: '/dashboard',
      icon: LayoutGrid,
    },
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
    {
      name: 'Useful Links',
      path: '/admin/useful-links',
      icon: Link2,
    },
    {
      name: t('nav.services'),
      path: '/admin/services',
      icon: Sparkles,
      highlight: true,
      tooltip: 'Manage and configure client services',
    },
  ];

  const menuItems = isAdmin ? adminMenuItems : clientMenuItems;

  return (
    <aside 
      className={cn(
        "bg-sidebar text-sidebar-foreground w-64 overflow-y-auto fixed top-[57px] left-0 z-40 pt-4 transition-transform duration-300 ease-in-out h-[calc(100vh-57px)]",
        isOpen ? "translate-x-0" : (isMobile ? "-translate-x-full" : "translate-x-0"),
        isMobile && "shadow-lg"
      )}
    >
      <SidebarHeader onClose={onClose} />
      <SidebarNav menuItems={menuItems} onClose={onClose} />
    </aside>
  );
};

export default Sidebar;
