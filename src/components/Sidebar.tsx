
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

type SidebarItem = {
  name: string;
  path: string;
  icon: React.ElementType;
  children?: SidebarItem[];
};

const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  
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
      children: [
        {
          name: t('nav.services.add'),
          path: '/admin/services/create',
          icon: Plus,
        },
      ],
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

  const menuItems = isAdmin ? adminMenuItems : clientMenuItems;

  const isItemActive = (item: SidebarItem): boolean => {
    if (location.pathname === item.path) return true;
    if (item.children) {
      return item.children.some(child => location.pathname === child.path);
    }
    return false;
  };

  const isParentActive = (path: string): boolean => {
    return location.pathname.startsWith(path) && path !== '/';
  };

  return (
    <aside 
      className={cn(
        "bg-sidebar text-sidebar-foreground w-64 min-h-screen overflow-y-auto fixed top-0 left-0 z-40 pt-4 transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : (isMobile ? "-translate-x-full" : "translate-x-0"),
        isMobile && "shadow-lg"
      )}
    >
      <div className="px-4 py-2 mb-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-white">Business Advisory</span>
          </Link>
          {isMobile && (
            <Button variant="ghost" size="sm" onClick={onClose} className="text-sidebar-foreground">
              &times;
            </Button>
          )}
        </div>
      </div>
      
      <nav className="px-4 pb-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              {!item.children ? (
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                    isItemActive(item) 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                      : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  )}
                  onClick={isMobile ? onClose : undefined}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  <span>{item.name}</span>
                </Link>
              ) : (
                <div className="mb-2">
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors",
                      isParentActive(item.path) 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    )}
                    onClick={isMobile ? onClose : undefined}
                  >
                    <div className="flex items-center">
                      <item.icon className="h-4 w-4 mr-2" />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                  
                  {isParentActive(item.path) && (
                    <ul className="pl-6 mt-1 space-y-1">
                      {item.children?.map((child) => (
                        <li key={child.path}>
                          <Link
                            to={child.path}
                            className={cn(
                              "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                              location.pathname === child.path
                                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                            )}
                            onClick={isMobile ? onClose : undefined}
                          >
                            <child.icon className="h-4 w-4 mr-2" />
                            <span>{child.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
