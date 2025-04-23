
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import SidebarHeader from './sidebar/SidebarHeader';
import SidebarNav from './sidebar/SidebarNav';
import { createAdminMenuItems, createClientMenuItems } from './sidebar/menu/menu-config';
import { SidebarProps } from './sidebar/types';

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  const isAdmin = user?.userType === 'admin';
  const menuItems = isAdmin ? createAdminMenuItems(t) : createClientMenuItems(t);

  return (
    <aside 
      className={cn(
        "bg-sidebar text-sidebar-foreground w-64 min-h-screen overflow-y-auto fixed top-0 left-0 z-40 pt-4 transition-transform duration-300 ease-in-out",
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

