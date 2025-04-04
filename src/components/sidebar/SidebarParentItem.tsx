
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SidebarItem } from './types';
import SidebarMenuItem from './SidebarMenuItem';
import { useIsMobile } from '@/hooks/use-mobile';

type SidebarParentItemProps = {
  item: SidebarItem;
  onClose?: () => void;
};

const SidebarParentItem: React.FC<SidebarParentItemProps> = ({ item, onClose }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const isParentActive = location.pathname.startsWith(item.path) && item.path !== '/';
  
  return (
    <div className="mb-2">
      <Link
        to={item.path}
        className={cn(
          "flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors",
          isParentActive 
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
      
      {isParentActive && item.children && (
        <ul className="pl-6 mt-1 space-y-1">
          {item.children.map((child) => (
            <li key={child.path}>
              <SidebarMenuItem item={child} onClose={onClose} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SidebarParentItem;
