
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

type SidebarSubmenuProps = {
  children: Array<{
    name: string;
    path: string;
    icon: React.ElementType;
  }>;
  isExpanded: boolean;
  onChildClick: () => void;
  currentPath: string;
};

const SidebarSubmenu: React.FC<SidebarSubmenuProps> = ({
  children,
  isExpanded,
  onChildClick,
  currentPath,
}) => {
  if (!isExpanded) return null;

  return (
    <ul className={cn(
      "pl-6 mt-1 space-y-1 overflow-hidden transition-all duration-200 ease-in-out",
      "animate-accordion-down"
    )}>
      {children.map((child) => (
        <li key={child.path}>
          <Link
            to={child.path}
            className={cn(
              "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
              currentPath === child.path
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            )}
            onClick={onChildClick}
          >
            <child.icon className="h-4 w-4 mr-2" />
            <span>{child.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SidebarSubmenu;
