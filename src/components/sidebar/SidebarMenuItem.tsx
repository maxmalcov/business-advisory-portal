
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SidebarItem } from './types';
import { useIsMobile } from '@/hooks/use-mobile';

type SidebarMenuItemProps = {
  item: SidebarItem;
  onClose?: () => void;
};

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ item, onClose }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const isActive = location.pathname === item.path;
  
  return (
    <Link
      to={item.path}
      className={cn(
        "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
        isActive 
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
          : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
      )}
      onClick={isMobile ? onClose : undefined}
    >
      <item.icon className="h-4 w-4 mr-2" />
      <span>{item.name}</span>
    </Link>
  );
};

export default SidebarMenuItem;
